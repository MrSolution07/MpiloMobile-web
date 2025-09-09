import React, { useState } from "react";
import { FileText, Download, Share2, Search, Filter, Upload, Edit, Trash2, MoreVertical, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
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
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-3 sm:p-4 md:p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-3 sm:p-4 md:p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-xs sm:text-sm text-gray-500 ${className}`} {...props}>
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
  <div className={`inline-flex h-9 sm:h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full sm:w-auto text-sm ${className}`}>
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
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 
      sm:px-3 py-1 sm:py-1.5 text-xs sm:text-xs 
      font-medium ring-offset-background transition-all 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
      disabled:pointer-events-none disabled:opacity-50 flex-1 sm:flex-none ${
      activeValue === triggerValue ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
    } ${className}`}
    onClick={() => onValueChange(triggerValue)}
  >
    {children}
  </button>
);

const Table = ({ className = "", children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ className = "", children, ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
);

const TableBody = ({ className = "", children, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ className = "", children, ...props }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 ${className}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ className = "", children, ...props }) => (
  <th className={`h-10 sm:h-12 px-2 sm:px-4 text-left align-middle font-medium text-gray-500 text-xs sm:text-sm [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ className = "", children, ...props }) => (
  <td className={`p-2 sm:p-4 align-middle text-xs sm:text-sm [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
    {children}
  </td>
);

const MobileRecordCard = ({ record }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          <div>
            <div className="font-medium text-sm sm:text-base">{record.patientName}</div>
            <div className="text-xs text-gray-500">ID: {record.patientId}</div>
          </div>
        </div>
          <span className={(record.status === "Completed" ? "status-active" : "status-pending") + " whitespace-nowrap px-2 py-1 text-xs font-semibold"}>
            {record.status}
          </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-3">
        <div>
          <div className="text-gray-500">Type</div>
          <div className="font-medium">{record.recordType}</div>
        </div>
        <div>
          <div className="text-gray-500">Department</div>
          <div className="font-medium">{record.department}</div>
        </div>
        <div>
          <div className="text-gray-500">Doctor</div>
          <div className="font-medium">{record.doctor}</div>
        </div>
        <div>
          <div className="text-gray-500">Date</div>
          <div className="font-medium">{record.date}</div>
        </div>
      </div>
      
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Records = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const initialRecords = [
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

  const [records] = useState(initialRecords);

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

  const handleNewRecord = () => {
    navigate('/admin/adminaddrecord');
  };

  return (
    <div className="animate-fade-in px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8 xl:px-16 2xl:px-32 w-full max-w-screen-2xl mx-auto">
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
          font-size: 0.625rem;
          font-weight: 500;
          background-color: #dcfce7;
          color: #166534;
        }
        .status-pending {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.625rem;
          font-weight: 500;
          background-color: #fef3c7;
          color: #92400e;
        }
        @media (min-width: 640px) {
          .status-active, .status-pending {
            font-size: 0.75rem;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-3xl sm:text-3xl lg:text-4xl text-black font-bold">Medical Records</span>
        <Button onClick={handleNewRecord} className="w-full sm:w-auto text-sm">
          <FileText className="mr-2 h-4 w-4" /> 
          <span className="sm:inline">New Record</span>
        </Button>
      </div>

      {/* Tabs Section */}
      <div className="mb-4 sm:mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-3 sm:inline-flex sm:w-auto">
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
          {/* Search and Filter Section */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search records..."
                className="pl-9 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Filter className="h-4 w-4" /> 
              <span className="sm:inline">Filter</span>
            </Button>
          </div>

          {/* Mobile View - Card Layout */}
          <div className="block md:hidden">
            {filteredRecords.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No records found matching the current filters</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <MobileRecordCard key={record.id} record={record} />
              ))
            )}
          </div>

          <div className="hidden md:block overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden lg:table-cell">Record Type</TableHead>
                  <TableHead className="hidden xl:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{record.patientName}</div>
                          <div className="text-xs text-gray-500">ID: {record.patientId}</div>
                          <div className="lg:hidden text-xs text-gray-600 mt-1">
                            {record.recordType} • {record.department}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{record.recordType}</TableCell>
                    <TableCell className="hidden xl:table-cell">{record.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="truncate max-w-32 xl:max-w-none">{record.doctor}</div>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <span className={record.status === "Completed" ? "status-active" : "status-pending"}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10">
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10">
                          <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10 hidden sm:inline-flex">
                          <Download className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10 hidden lg:inline-flex">
                          <Share2 className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 mb-4 text-gray-300" />
                        <p>No records found matching the current filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Records;
// import React, { useState } from "react";
// import { FileText, Download, Share2, Search, Filter, Upload, Edit, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
//   const variants = {
//     default: "bg-red-600 text-white hover:bg-red-700",
//     outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
//     ghost: "hover:bg-gray-100 hover:text-gray-900",
//     destructive: "bg-red-600 text-white hover:bg-red-700",
//   };
//   const sizes = {
//     default: "h-10 px-4 py-2",
//     sm: "h-9 rounded-md px-3",
//     lg: "h-11 rounded-md px-8",
//     icon: "h-10 w-10",
//   };

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const Input = ({ className = "", ...props }) => (
//   <input
//     className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//     {...props}
//   />
// );

// const Card = ({ className = "", children, ...props }) => (
//   <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
//     {children}
//   </div>
// );

// const CardContent = ({ className = "", children, ...props }) => (
//   <div className={`p-6 ${className}`} {...props}>
//     {children}
//   </div>
// );

// const CardHeader = ({ className = "", children, ...props }) => (
//   <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
//     {children}
//   </div>
// );

// const CardTitle = ({ className = "", children, ...props }) => (
//   <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
//     {children}
//   </h3>
// );

// const CardDescription = ({ className = "", children, ...props }) => (
//   <p className={`text-sm text-gray-500 ${className}`} {...props}>
//     {children}
//   </p>
// );

// const Tabs = ({ value, onValueChange, children, className = "" }) => (
//   <div className={className}>
//     {React.Children.map(children, child =>
//       React.cloneElement(child, { value, onValueChange })
//     )}
//   </div>
// );

// const TabsList = ({ className = "", children, value, onValueChange }) => (
//   <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
//     {React.Children.map(children, child =>
//       React.cloneElement(child, {
//         activeValue: value,
//         onValueChange,
//       })
//     )}
//   </div>
// );

// const TabsTrigger = ({ value: triggerValue, onValueChange, activeValue, className = "", children }) => (
//   <button
//     className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
//       activeValue === triggerValue ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
//     } ${className}`}
//     onClick={() => onValueChange(triggerValue)}
//   >
//     {children}
//   </button>
// );

// const Table = ({ className = "", children, ...props }) => (
//   <div className="relative w-full overflow-auto">
//     <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
//       {children}
//     </table>
//   </div>
// );
// const TableHeader = ({ className = "", children, ...props }) => (
//   <thead className={`[&_tr]:border-b ${className}`} {...props}>
//     {children}
//   </thead>
// );
// const TableBody = ({ className = "", children, ...props }) => (
//   <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
//     {children}
//   </tbody>
// );
// const TableRow = ({ className = "", children, ...props }) => (
//   <tr className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 ${className}`} {...props}>
//     {children}
//   </tr>
// );
// const TableHead = ({ className = "", children, ...props }) => (
//   <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
//     {children}
//   </th>
// );
// const TableCell = ({ className = "", children, ...props }) => (
//   <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
//     {children}
//   </td>
// );

// const Records = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");
//   const [search, setSearch] = useState("");

//   const initialRecords = [
//     {
//       id: "REC001",
//       patientName: "Sipho Dlamini",
//       patientId: "P001",
//       recordType: "Lab Results",
//       department: "Cardiology",
//       date: "2023-05-15",
//       doctor: "Dr. Thandiwe Nkosi",
//       status: "Completed",
//     },
//     {
//       id: "REC002",
//       patientName: "Naledi Mokoena",
//       patientId: "P002",
//       recordType: "MRI Scan",
//       department: "Neurology",
//       date: "2023-05-10",
//       doctor: "Dr. Kagiso Mthembu",
//       status: "Pending Review",
//     },
//     {
//       id: "REC003",
//       patientName: "Lebo Mashaba",
//       patientId: "P003",
//       recordType: "Prescription",
//       department: "General Medicine",
//       date: "2023-05-08",
//       doctor: "Dr. Zanele Khumalo",
//       status: "Completed",
//     },
//     {
//       id: "REC004",
//       patientName: "Ayanda Ndlovu",
//       patientId: "P004",
//       recordType: "X-Ray",
//       department: "Orthopedics",
//       date: "2023-05-05",
//       doctor: "Dr. Sibusiso Maseko",
//       status: "Completed",
//     },
//   ];

//   const [records] = useState(initialRecords);

//   const filteredRecords = records.filter(record => {
//     if (activeTab === "pending" && !record.status.toLowerCase().startsWith("pending")) return false;
//     if (activeTab === "completed" && record.status !== "Completed") return false;

//     if (search.trim() !== "") {
//       const q = search.toLowerCase();
//       return (
//         record.patientName.toLowerCase().includes(q) ||
//         record.patientId.toLowerCase().includes(q) ||
//         record.recordType.toLowerCase().includes(q)
//       );
//     }
//     return true;
//   });

//   const handleNewRecord = () => {
//     navigate('/admin/adminaddrecord');
//   };

//   return (
//   <div className="animate-fade-in px-2 py-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full max-w-screen-2xl mx-auto">
//       <style jsx>{`
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-in-out;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .status-active {
//           display: inline-flex;
//           align-items: center;
//           border-radius: 9999px;
//           padding: 0.25rem 0.5rem;
//           font-size: 0.75rem;
//           font-weight: 500;
//           background-color: #dcfce7;
//           color: #166534;
//         }
//         .status-pending {
//           display: inline-flex;
//           align-items: center;
//           border-radius: 9999px;
//           padding: 0.25rem 0.5rem;
//           font-size: 0.75rem;
//           font-weight: 500;
//           background-color: #fef3c7;
//           color: #92400e;
//         }
//       `}</style>

//       <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-3xl sm:text-3xl text-black font-bold">Medical Records</h1>
//         <Button onClick={handleNewRecord} className="w-full sm:w-auto">
//           <FileText className="mr-2 h-4 w-4" /> New Record
//         </Button>
//       </div>

//       <div className="mb-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList value={activeTab} onValueChange={setActiveTab}>
//             <TabsTrigger value="all">All Records</TabsTrigger>
//             <TabsTrigger value="pending">Pending</TabsTrigger>
//             <TabsTrigger value="completed">Completed</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle>Patient Records</CardTitle>
//           <CardDescription>Browse and manage all patient medical records in your facility</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-6 flex flex-col gap-4 sm:flex-row">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//               <Input
//                 placeholder="Search records by patient name, ID, or type..."
//                 className="pl-9"
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//               />
//             </div>
//             <Button variant="outline" className="flex items-center gap-2">
//               <Filter className="h-4 w-4" /> Filter
//             </Button>
//           </div>

//           <div className="overflow-auto rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Patient</TableHead>
//                   <TableHead>Record Type</TableHead>
//                   <TableHead>Department</TableHead>
//                   <TableHead>Doctor</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredRecords.map((record) => (
//                   <TableRow key={record.id}>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <FileText className="h-5 w-5 text-red-600" />
//                         <div>
//                           <div className="font-medium">{record.patientName}</div>
//                           <div className="text-xs text-gray-500">ID: {record.patientId}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{record.recordType}</TableCell>
//                     <TableCell>{record.department}</TableCell>
//                     <TableCell>{record.doctor}</TableCell>
//                     <TableCell>{record.date}</TableCell>
//                     <TableCell>
//                       <span className={record.status === "Completed" ? "status-active" : "status-pending"}>
//                         {record.status}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-1">
//                         <Button variant="ghost" size="icon">
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Download className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Share2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {filteredRecords.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center text-gray-500 py-8">
//                       No records found matching the current filters
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Records;