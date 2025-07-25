import React from "react";
import { Package, AlertTriangle, Plus, Search, Scan, Filter, Calendar, TrendingDown, TrendingUp, Edit, Trash2, Camera, X, CheckCircle, Loader, Settings } from "lucide-react";
import { useState, ReactNode, useRef, useEffect, useCallback } from "react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface InventoryStat {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  change: string;
  trend: 'up' | 'down';
}

interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  stock: number;
  minStock: number;
  unit: string;
  expiryDate: string;
  fabricationDate?: string;
  batchNumber: string;
  supplier: string;
  unitPrice: number;
  location: string;
  barcode: string;
  scannedAt?: string;
}

interface ProductInfo {
  name: string;
  manufacturer?: string;
  fabricationDate?: string;
  expiryDate?: string;
  batchNumber?: string;
  unitPrice?: number;
  category?: ItemCategory;
  description?: string;
}

interface APIResponse {
  success: boolean;
  data?: ProductInfo;
  error?: string;
  source?: string;
}

interface StockStatus {
  label: string;
  variant: BadgeVariant;
}

interface ExpiryStatus {
  label: string;
  variant: BadgeVariant;
}

type ItemCategory = 'Medication' | 'Supplies' | 'Equipment';
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
}

interface BadgeProps {
  className?: string;
  variant?: BadgeVariant;
  children: ReactNode;
}

// API Service for product information lookup
class ProductAPIService {
  private static readonly FDA_API = 'https://api.fda.gov/drug/ndc.json';
  private static readonly UPC_API_KEY_STORAGE = 'upc_api_key'; // they didnt give me one
  private static readonly BARCODE_API_KEY_STORAGE = 'barcode_api_key';//. worse 

  // Save API keys to localStorage for security will share once get one
  static saveUPCAPIKey(apiKey: string): void {
    localStorage.setItem(this.UPC_API_KEY_STORAGE, apiKey);
  }

  static saveBarcodeAPIKey(apiKey: string): void {
    localStorage.setItem(this.BARCODE_API_KEY_STORAGE, apiKey);
  }

  static getUPCAPIKey(): string | null {
    return localStorage.getItem(this.UPC_API_KEY_STORAGE);
  }

  static getBarcodeAPIKey(): string | null {
    return localStorage.getItem(this.BARCODE_API_KEY_STORAGE);
  }

  // Main lookup function that tries multiple APIs
  static async lookupProduct(barcode: string): Promise<APIResponse> {
    console.log('Looking up product for barcode:', barcode);

    // so i will use all of them to find the one that works 
    // Try FDA API first for medications
    try {
      const fdaResult = await this.lookupFromFDA(barcode);
      if (fdaResult.success) return fdaResult;
    } catch (error) {
      console.log('FDA API failed, trying other sources');
    }

    // Try UPC Database API
    const upcApiKey = this.getUPCAPIKey();
    if (upcApiKey) {
      try {
        const upcResult = await this.lookupFromUPCDatabase(barcode, upcApiKey);
        if (upcResult.success) return upcResult;
      } catch (error) {
        console.log('UPC Database API failed');
      }
    }

    // Try Barcode Lookup API
    const barcodeApiKey = this.getBarcodeAPIKey();
    if (barcodeApiKey) {
      try {
        const barcodeResult = await this.lookupFromBarcodeAPI(barcode, barcodeApiKey);
        if (barcodeResult.success) return barcodeResult;
      } catch (error) {
        console.log('Barcode Lookup API failed');
      }
    }

    // Fallback to mock data if all APIs fail
    return this.getMockProductData(barcode);
  }

  // FDA openFDA API lookup
  private static async lookupFromFDA(searchTerm: string): Promise<APIResponse> {
    try {
      const queries = [
        `product_ndc:\"${searchTerm}\"`,
        `packaging.package_ndc:\"${searchTerm}\"`
      ];

      for (const query of queries) {
        const response = await fetch(
          `${this.FDA_API}?search=${encodeURIComponent(query)}&limit=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const drug = data.results[0];
            return {
              success: true,
              data: this.transformFDAData(drug),
              source: 'FDA'
            };
          }
        }
      }
      
      return { success: false, error: 'Product not found in FDA database' };
    } catch (error) {
      return { success: false, error: 'FDA API request failed' };
    }
  }

  // UPC Database API lookup (requires API key)
  private static async lookupFromUPCDatabase(barcode: string, apiKey: string): Promise<APIResponse> {
    try {
      const response = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-API-KEY': apiKey
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return {
            success: true,
            data: {
              name: item.title,
              manufacturer: item.brand,
              description: item.description,
              category: this.guessCategory(item.title),
              // UPC database doesn't provide dates, so we generate reasonable defaults
              fabricationDate: new Date().toISOString().split('T')[0],
              expiryDate: this.generateDefaultExpiryDate(item.title)
            },
            source: 'UPC Database'
          };
        }
      }
      
      return { success: false, error: 'Product not found in UPC database' };
    } catch (error) {
      return { success: false, error: 'UPC Database API request failed' };
    }
  }

  // Barcode Lookup API (alternative service)
  private static async lookupFromBarcodeAPI(barcode: string, apiKey: string): Promise<APIResponse> {
    try {
      const response = await fetch(
        `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          const product = data.products[0];
          return {
            success: true,
            data: {
              name: product.title,
              manufacturer: product.manufacturer,
              description: product.description,
              category: this.guessCategory(product.title),
              fabricationDate: new Date().toISOString().split('T')[0],
              expiryDate: this.generateDefaultExpiryDate(product.title)
            },
            source: 'Barcode Lookup'
          };
        }
      }
      
      return { success: false, error: 'Product not found in Barcode Lookup' };
    } catch (error) {
      return { success: false, error: 'Barcode Lookup API request failed' };
    }
  }

  // Transform FDA data to our format
  private static transformFDAData(drug: any): ProductInfo {
    const marketingDate = drug.marketing_start_date ? new Date(drug.marketing_start_date) : new Date();
    const expiryDate = new Date(marketingDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3); // Default 3 years shelf life

    return {
      name: drug.brand_name || drug.generic_name,
      manufacturer: drug.labeler_name,
      fabricationDate: marketingDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      category: 'Medication',
      description: `${drug.dosage_form} - ${drug.strength}`
    };
  }

  // Generate default expiry based on product type
  private static generateDefaultExpiryDate(productName: string): string {
    const name = productName.toLowerCase();
    const today = new Date();
    let monthsToAdd = 12; // Default 1 year

    if (name.includes('medicine') || name.includes('tablet') || name.includes('capsule')) {
      monthsToAdd = 36; // 3 years for medications
    } else if (name.includes('bandage') || name.includes('gauze') || name.includes('syringe')) {
      monthsToAdd = 60; // 5 years for supplies
    } else if (name.includes('equipment') || name.includes('device') || name.includes('monitor')) {
      monthsToAdd = 120; // 10 years for equipment
    }

    const expiryDate = new Date(today);
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
    return expiryDate.toISOString().split('T')[0];
  }

  // Guess category based on product name
  private static guessCategory(productName: string): ItemCategory {
    const name = productName.toLowerCase();
    
    if (name.includes('tablet') || name.includes('capsule') || name.includes('medicine') || 
        name.includes('drug') || name.includes('injection') || name.includes('syrup') ||
        name.includes('insulin') || name.includes('antibiotic')) {
      return 'Medication';
    }
    
    if (name.includes('monitor') || name.includes('device') || name.includes('machine') || 
        name.includes('equipment') || name.includes('scanner') || name.includes('thermometer')) {
      return 'Equipment';
    }
    
    return 'Supplies';
  }

  // Mock data for demonstration
  private static getMockProductData(barcode: string): APIResponse {
    const mockProducts: { [key: string]: ProductInfo } = {
      '1234567890123': {
        name: 'Paracetamol Tablets 500mg',
        manufacturer: 'PharmaCorp SA',
        fabricationDate: '2024-01-15',
        expiryDate: '2026-01-15',
        batchNumber: 'PAR2024001',
        category: 'Medication',
        unitPrice: 0.85
      },
      '2345678901234': {
        name: 'Digital Thermometer',
        manufacturer: 'MedTech Solutions',
        fabricationDate: '2024-02-10',
        expiryDate: '2029-02-10',
        batchNumber: 'THM2024001',
        category: 'Equipment',
        unitPrice: 450.00
      },
      '3456789012345': {
        name: 'Surgical Gloves (Box)',
        manufacturer: 'MedSupply Co',
        fabricationDate: '2024-03-05',
        expiryDate: '2027-03-05',
        batchNumber: 'GLV2024001',
        category: 'Supplies',
        unitPrice: 125.50
      }
    };

    const product = mockProducts[barcode] || {
      name: 'Unknown Medical Product',
      manufacturer: 'Unknown Manufacturer',
      fabricationDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchNumber: `BATCH${Date.now()}`,
      category: 'Supplies' as ItemCategory,
      unitPrice: 0
    };

    return { success: true, data: product, source: 'Mock Data' };
  }
}

// UI Components (keeping your original styling)
const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const Button: React.FC<ButtonProps> = ({ className = "", variant = "default", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2";
  const variants: Record<ButtonVariant, string> = {
    default: "bg-[#274D60] text-white hover:bg-[#1e3a4a]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge: React.FC<BadgeProps> = ({ className = "", variant = "default", children }) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Enhanced Barcode Scanner Component
const AdvancedBarcodeScanner: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (productInfo: InventoryItem) => void;
}> = ({ isOpen, onClose, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [apiSource, setApiSource] = useState<string>('');
  const [codeReader] = useState(() => new BrowserMultiFormatReader());

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsScanning(true);
      
      // Start barcode scanning
      startBarcodeScanning();
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startBarcodeScanning = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      await codeReader.decodeFromVideoDevice(null, videoRef.current, async (result, error) => {
        if (result) {
          const barcode = result.getText();
          console.log('Barcode detected:', barcode);
          await handleBarcodeDetected(barcode);
        }
        
        if (error && !(error instanceof NotFoundException)) {
          console.warn('Scanning error:', error);
        }
      });
    } catch (err) {
      console.error('Failed to start barcode scanning:', err);
      setError('Failed to start barcode scanning');
    }
  }, [codeReader]);

  const handleBarcodeDetected = async (barcode: string) => {
    setIsScanning(false);
    setIsLoading(true);
    
    try {
      // Stop scanning
      codeReader.reset();
      
      // Lookup product information
      const apiResponse = await ProductAPIService.lookupProduct(barcode);
      
      if (apiResponse.success && apiResponse.data) {
        setScannedProduct(apiResponse.data);
        setApiSource(apiResponse.source || 'Unknown');
      } else {
        setError(apiResponse.error || 'Product not found');
      }
    } catch (err) {
      console.error('Failed to process barcode:', err);
      setError('Failed to process barcode data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = () => {
    if (scannedProduct) {
      const newItem: InventoryItem = {
        id: `SCAN-${Date.now()}`,
        name: scannedProduct.name,
        category: scannedProduct.category || 'Supplies',
        stock: 1,
        minStock: 10,
        unit: 'units',
        expiryDate: scannedProduct.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fabricationDate: scannedProduct.fabricationDate,
        batchNumber: scannedProduct.batchNumber || `BATCH${Date.now()}`,
        supplier: scannedProduct.manufacturer || 'Unknown Supplier',
        unitPrice: scannedProduct.unitPrice || 0,
        location: 'A1-S1',
        barcode: `SCANNED-${Date.now()}`,
        scannedAt: new Date().toISOString()
      };
      
      onScanComplete(newItem);
      handleClose();
    }
  };

  const handleClose = () => {
    codeReader.reset();
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setScannedProduct(null);
    setError('');
    onClose();
  };

  useEffect(() => {
    if (isOpen && !scannedProduct) {
      startCamera();
    }
    
    return () => {
      codeReader.reset();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, scannedProduct, startCamera, codeReader]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#274D60] text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <Scan className="w-5 h-5 mr-2" />
            Smart Barcode Scanner
          </h3>
          <button onClick={handleClose} className="text-white hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {scannedProduct ? (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <div>
                  <h3 className="text-lg font-semibold">Product Found!</h3>
                  <p className="text-sm text-gray-500">Source: {apiSource}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="font-medium text-gray-700">Product Name:</label>
                  <p className="text-gray-900">{scannedProduct.name}</p>
                </div>
                {scannedProduct.manufacturer && (
                  <div>
                    <label className="font-medium text-gray-700">Manufacturer:</label>
                    <p className="text-gray-900">{scannedProduct.manufacturer}</p>
                  </div>
                )}
                {scannedProduct.fabricationDate && (
                  <div>
                    <label className="font-medium text-gray-700">Fabrication Date:</label>
                    <p className="text-gray-900">{new Date(scannedProduct.fabricationDate).toLocaleDateString()}</p>
                  </div>
                )}
                {scannedProduct.expiryDate && (
                  <div>
                    <label className="font-medium text-gray-700">Expiry Date:</label>
                    <p className="text-gray-900">{new Date(scannedProduct.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {scannedProduct.category && (
                  <div>
                    <label className="font-medium text-gray-700">Category:</label>
                    <Badge>{scannedProduct.category}</Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddToInventory} className="flex-1">
                  Add to Inventory
                </Button>
                <Button variant="outline" onClick={() => setScannedProduct(null)}>
                  Scan Another
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-green-500 bg-transparent w-48 h-32 relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-green-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-green-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-green-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-green-500"></div>
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                )}
                
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Processing barcode...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                {error ? (
                  <div className="flex items-center justify-center text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                ) : isScanning ? (
                  <div className="space-y-1">
                    <p className="text-gray-600">Position the barcode within the frame</p>
                    <p className="text-sm text-gray-500">Scanner will automatically detect and lookup product information</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Starting camera...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// API Settings Modal
const APISettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [upcApiKey, setUpcApiKey] = useState(ProductAPIService.getUPCAPIKey() || '');
  const [barcodeApiKey, setBarcodeApiKey] = useState(ProductAPIService.getBarcodeAPIKey() || '');

  const handleSave = () => {
    if (upcApiKey.trim()) {
      ProductAPIService.saveUPCAPIKey(upcApiKey.trim());
    }
    if (barcodeApiKey.trim()) {
      ProductAPIService.saveBarcodeAPIKey(barcodeApiKey.trim());
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          API Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPC Database API Key (Optional)
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#274D60]"
              placeholder="Enter your UPC Database API key"
              value={upcApiKey}
              onChange={(e) => setUpcApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Get free API key from <a href="https://www.upcitemdb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">upcitemdb.com</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Lookup API Key (Optional)
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#274D60]"
              placeholder="Enter your Barcode Lookup API key"
              value={barcodeApiKey}
              onChange={(e) => setBarcodeApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Get API key from <a href="https://www.barcodelookup.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">barcodelookup.com</a>
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Sorry guys but i was lazy to try copy paste this one is faster you test and move on when it will work we will remove this
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component right here
const EnhancedInventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [showAPISettings, setShowAPISettings] = useState<boolean>(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "MED001",
      name: "Paracetamol 500mg",
      category: "Medication",
      stock: 450,
      minStock: 100,
      unit: "tablets",
      expiryDate: "2025-12-15",
      fabricationDate: "2024-01-15",
      batchNumber: "PAR2024001",
      supplier: "PharmaCorp SA",
      unitPrice: 0.85,
      location: "A1-S2",
      barcode: "1234567890123"
    },
    {
      id: "MED002",
      name: "Insulin Pen",
      category: "Medication",
      stock: 25,
      minStock: 50,
      unit: "pens",
      expiryDate: "2025-03-20",
      fabricationDate: "2024-02-10",
      batchNumber: "INS2024002",
      supplier: "DiabetesCare Ltd",
      unitPrice: 245.00,
      location: "B2-S1",
      barcode: "2345678901234"
    },
    {
      id: "SUP001",
      name: "Surgical Gloves (Box)",
      category: "Supplies",
      stock: 180,
      minStock: 50,
      unit: "boxes",
      expiryDate: "2026-08-10",
      fabricationDate: "2024-03-05",
      batchNumber: "GLV2024001",
      supplier: "MedSupply Co",
      unitPrice: 125.50,
      location: "C1-S3",
      barcode: "3456789012345"
    }
  ]);

  // Calculate dynamic stats based on current inventory
  const calculateStats = (): InventoryStat[] => {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(item => item.stock <= item.minStock).length;
    const expiredItems = inventoryItems.filter(item => new Date(item.expiryDate) < new Date()).length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.stock * item.unitPrice), 0);

    return [
      {
        title: "Total Items",
        value: totalItems.toString(),
        icon: Package,
        change: "+3.2%",
        trend: "up",
      },
      {
        title: "Low Stock Items",
        value: lowStockItems.toString(),
        icon: AlertTriangle,
        change: "-12%",
        trend: "down",
      },
      {
        title: "Expired Items",
        value: expiredItems.toString(),
        icon: Calendar,
        change: "+5%",
        trend: "up",
      },
      {
        title: "Total Value",
        value: `R ${(totalValue / 1000000).toFixed(1)}M`,
        icon: TrendingUp,
        change: "+8.1%",
        trend: "up",
      },
    ];
  };

  const categories: (string | ItemCategory)[] = ["all", "Medication", "Supplies", "Equipment"];

  const filteredItems: InventoryItem[] = inventoryItems.filter((item: InventoryItem) => {
    const matchesSearch: boolean = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory: boolean = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number, minStock: number): StockStatus => {
    if (stock === 0) return { label: "Out of Stock", variant: "danger" };
    if (stock <= minStock) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
    const today: Date = new Date();
    const expiry: Date = new Date(expiryDate);
    const daysUntilExpiry: number = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: "Expired", variant: "danger" };
    if (daysUntilExpiry <= 30) return { label: "Expires Soon", variant: "warning" };
    return { label: "Valid", variant: "success" };
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const handleScanComplete = (newItem: InventoryItem) => {
    setInventoryItems(prev => [...prev, newItem]);
  };

  const inventoryStats = calculateStats();

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .card-hover {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .table-hover:hover {
          background-color: #f8fafc;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h1 className="font-bold text-3xl text-black">Smart Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage medical supplies with automated scanning </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowAPISettings(true)}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            API Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowScanModal(true)}
            className="flex items-center gap-2"
          >
            <Scan size={16} />
            Smart Scan
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {inventoryStats.map((stat: InventoryStat, index: number) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="mt-1 font-bold text-2xl">{stat.value}</h3>
                </div>
                <div className="bg-[#274D60]/10 p-2 rounded-full text-[#274D60]">
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-center mt-3 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 w-3 h-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1 text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, ID, or batch number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#274D60] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#274D60] focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((category: string | ItemCategory) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
          <CardDescription>Detailed view of all inventory items with automated scanning data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Item Details</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Stock Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Dates</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Location</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Supplier</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Value</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: InventoryItem) => {
                  const stockStatus: StockStatus = getStockStatus(item.stock, item.minStock);
                  const expiryStatus: ExpiryStatus = getExpiryStatus(item.expiryDate);
                  const totalValue: number = item.stock * item.unitPrice;
                  
                  return (
                    <tr key={item.id} className="border-b table-hover">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">ID: {item.id}</p>
                          <p className="text-xs text-gray-500">Batch: {item.batchNumber}</p>
                          <Badge className="mt-1">{item.category}</Badge>
                          {item.scannedAt && (
                            <p className="text-xs text-blue-600 mt-1">✓ Auto-scanned</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium">{item.stock} {item.unit}</p>
                          <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                          <Badge variant={stockStatus.variant} className="mt-1">
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {item.fabricationDate && (
                            <div>
                              <p className="text-xs text-gray-500">Mfg:</p>
                              <p className="text-sm">{formatDate(item.fabricationDate)}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500">Exp:</p>
                            <p className="text-sm">{formatDate(item.expiryDate)}</p>
                            <Badge variant={expiryStatus.variant} className="mt-1">
                              {expiryStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-mono">{item.location}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{item.supplier}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium">{formatCurrency(totalValue)}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)}/unit</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={14} />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => setInventoryItems(prev => prev.filter(i => i.id !== item.id))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AdvancedBarcodeScanner
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onScanComplete={handleScanComplete}
      />

      <APISettingsModal
        isOpen={showAPISettings}
        onClose={() => setShowAPISettings(false)}
      />

      {/* Simple Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <p className="text-gray-600 mb-4">Manual entry form would go here. For now, use the Smart Scan feature for automated product detection!</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddModal(false)}>
                Use Smart Scan Instead
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedInventoryManagement;
