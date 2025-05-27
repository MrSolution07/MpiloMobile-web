import React, { useState } from "react";
import { FileText, Download, Share2, Search, Filter, Upload } from "lucide-react";

const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-[#274D60] text-white hover:bg-[#1A3A4A]",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#274D60] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const Tabs = ({ value, onValueChange, children, className = "" }) => (
  <div className={className}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

const TabsList = ({ className = "", children, value, onValueChange }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        activeValue: value,
        onValueChange,
      })
    )}
  </div>
);

const TabsTrigger = ({ value: triggerValue, onValueChange, activeValue, className = "", children }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeValue === triggerValue ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
    } ${className}`}
    onClick={() => onValueChange(triggerValue)}
  >
    {children}
  </button>
);

const AdminRecords = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const records = [
    {
      id: "REC001",
      patientName: "Sipho Dlamini",
      patientId: "P001",
      recordType: "Lab Results",
      department: "Cardiology",
      date: "2023-05-15",
      doctor: "Dr. Thandiwe Nkosi",
      status: "Completed",
    },
    {
      id: "REC002",
      patientName: "Naledi Mokoena",
      patientId: "P002",
      recordType: "MRI Scan",
      department: "Neurology",
      date: "2023-05-10",
      doctor: "Dr. Kagiso Mthembu",
      status: "Pending Review",
    },
    {
      id: "REC003",
      patientName: "Lebo Mashaba",
      patientId: "P003",
      recordType: "Prescription",
      department: "General Medicine",
      date: "2023-05-08",
      doctor: "Dr. Zanele Khumalo",
      status: "Completed",
    },
    {
      id: "REC004",
      patientName: "Ayanda Ndlovu",
      patientId: "P004",
      recordType: "X-Ray",
      department: "Orthopedics",
      date: "2023-05-05",
      doctor: "Dr. Sibusiso Maseko",
      status: "Completed",
    },
  ];

  const filteredRecords = records.filter(record => {
    if (activeTab === "pending" && !record.status.toLowerCase().startsWith("pending")) return false;
    if (activeTab === "completed" && record.status !== "Completed") return false;

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      return (
        record.patientName.toLowerCase().includes(q) ||
        record.patientId.toLowerCase().includes(q) ||
        record.recordType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .status-active {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #dcfce7;
          color: #166534;
        }
        .status-pending {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #fef3c7;
          color: #92400e;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-3xl">Medical Records</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Records
          </Button>
          <Button>
            <FileText className="mr-2 w-4 h-4" /> New Record
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList value={activeTab} onValueChange={setActiveTab}>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Browse and manage all patient medical records in your facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex sm:flex-row flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="top-3 left-3 absolute w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search records by patient name, ID, or type..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          <div className="border rounded-md overflow-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 border-b font-medium text-sm">
                <div className="col-span-3">Patient / Record</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Doctor</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {filteredRecords.map((record) => (
                <div key={record.id} className="grid grid-cols-12 hover:bg-gray-50 px-4 py-4 border-b">
                  <div className="col-span-3">
                    <div className="flex items-start">
                      <div className="bg-[#274D60]/10 mr-3 p-2 rounded-md text-[#274D60]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{record.patientName}</p>
                        <p className="text-gray-500 text-xs">{record.recordType}</p>
                        <p className="text-gray-500 text-xs">ID: {record.patientId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center col-span-2">{record.department}</div>
                  <div className="flex items-center col-span-2">{record.doctor}</div>
                  <div className="flex items-center col-span-2">{record.date}</div>
                  <div className="flex items-center col-span-2">
                    <span className={record.status === "Completed" ? "status-active" : "status-pending"}>
                      {record.status}
                    </span>
                  </div>
                  <div className="flex justify-end items-center col-span-1">
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Share2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}

              {filteredRecords.length === 0 && (
                <div className="py-8 text-gray-500 text-center">
                  No records found matching the current filters
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecords;
