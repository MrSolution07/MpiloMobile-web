import React from "react";//n is this line even important ?
import { Package, AlertTriangle, Plus, Search, Scan, Filter, Calendar, TrendingDown, TrendingUp, Edit, Trash2 } from "lucide-react";
import { useState, ReactNode } from "react";


interface InventoryStat {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  batchNumber: string;
  supplier: string;
  unitPrice: number;
  location: string;
  barcode: string;
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

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);

  // inventory templates data from chat 
  const inventoryStats: InventoryStat[] = [
    {
      title: "Total Items",
      value: "1,847",
      icon: Package,
      change: "+3.2%",
      trend: "up",
    },
    {
      title: "Low Stock Items",
      value: "23",
      icon: AlertTriangle,
      change: "-12%",
      trend: "down",
    },
    {
      title: "Expired Items",
      value: "8",
      icon: Calendar,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Total Value",
      value: "R 2.4M",
      icon: TrendingUp,
      change: "+8.1%",
      trend: "up",
    },
  ];

  const inventoryItems: InventoryItem[] = [
    {
      id: "MED001",
      name: "Paracetamol 500mg",
      category: "Medication",
      stock: 450,
      minStock: 100,
      unit: "tablets",
      expiryDate: "2025-12-15",
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
      batchNumber: "GLV2024001",
      supplier: "MedSupply Co",
      unitPrice: 125.50,
      location: "C1-S3",
      barcode: "3456789012345"
    },
    {
      id: "EQU001",
      name: "Digital Thermometer",
      category: "Equipment",
      stock: 12,
      minStock: 15,
      unit: "units",
      expiryDate: "2027-01-01",
      batchNumber: "THM2024001",
      supplier: "MedTech Solutions",
      unitPrice: 450.00,
      location: "D1-S1",
      barcode: "4567890123456"
    },
    {
      id: "MED003",
      name: "Amoxicillin 250mg",
      category: "Medication",
      stock: 8,
      minStock: 30,
      unit: "capsules",
      expiryDate: "2025-01-30",
      batchNumber: "AMX2024003",
      supplier: "PharmaCorp SA",
      unitPrice: 1.20,
      location: "A1-S4",
      barcode: "5678901234567"
    }
  ];

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilterCategory(e.target.value);
  };

  const handleAddModal = (): void => {
    setShowAddModal(true);
  };

  const handleScanModal = (): void => {
    setShowScanModal(true);
  };

  const closeAddModal = (): void => {
    setShowAddModal(false);
  };

  const closeScanModal = (): void => {
    setShowScanModal(false);
  };

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
          <h1 className="font-bold text-3xl text-black">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage medical supplies, medications, and equipment</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleScanModal}
            className="flex items-center gap-2"
          >
            <Scan size={16} />
            Scan Barcode
          </Button>
          <Button 
            onClick={handleAddModal}
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
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#274D60] focus:border-transparent"
                value={filterCategory}
                onChange={handleCategoryChange}
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
          <CardDescription>Detailed view of all inventory items</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Item Details</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Stock Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Expiry</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Location</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Supplier</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Value</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: InventoryItem, index: number) => {
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
                        <div>
                          <p className="text-sm">{formatDate(item.expiryDate)}</p>
                          <Badge variant={expiryStatus.variant} className="mt-1">
                            {expiryStatus.label}
                          </Badge>
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
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
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

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <p className="text-gray-600 mb-4">Form would go here with fields for item details</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeAddModal}>
                Cancel
              </Button>
              <Button>Save Item</Button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Barcode Scanner</h3>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Scan size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Camera view would appear here</p>
              <p className="text-sm text-gray-500 mt-2">Position barcode within the frame</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeScanModal}>
                Cancel
              </Button>
              <Button>Start Scanning</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;