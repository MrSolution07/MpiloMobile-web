import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Filter,
  Search,
  Plus,
  User,
  Clock,
  Heart,
  Activity,
} from "lucide-react";
import { Card, Button, Badge, CardHeader, CardTitle, CardContent } from "../ui";
import { mockTriageCases as fetchTriageCases } from "../../data";
import { formatDateTime } from "../../utils";
import { Preloader } from "../preloader";

const TriageList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const data = await fetchTriageCases();
        setCases(data);
      } catch (error) {
        console.error("Error loading triage cases:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter triage cases
  const filteredCases = cases.filter((triageCase) => {
    const matchesSearch =
      triageCase?.patient_id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      triageCase?.chief_complaint
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || triageCase?.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || triageCase?.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort cases by priority (high -> medium -> low) and then by arrival time (oldest first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(a.arrivalTime) - new Date(b.arrivalTime);
  });

  // Group cases by status
  const groupedCases = {
    waiting: sortedCases.filter((c) => c.status === "waiting"),
    "in-progress": sortedCases.filter((c) => c.status === "in-progress"),
    completed: sortedCases.filter((c) => c.status === "completed"),
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">Triage</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and prioritize emergency cases
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>

          <Link to="/dashboard/newtriage">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              New Triage Case
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient name or complaint..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === "waiting"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("waiting")}
                >
                  Waiting
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("in-progress")}
                >
                  In Progress
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setPriorityFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === "high"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setPriorityFilter("high")}
                >
                  High
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setPriorityFilter("medium")}
                >
                  Medium
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === "low"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setPriorityFilter("low")}
                >
                  Low
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Triage Board */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        {/* Waiting */}
        <Card>
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-blue-900 text-lg">
                <Clock className="mr-2 w-5 h-5 text-blue-700" />
                Waiting
              </CardTitle>
              <Badge
                text={`${groupedCases.waiting.length} cases`}
                variant="primary"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases.waiting.length > 0 ? (
              groupedCases.waiting.map((triageCase) => (
                <div
                  key={triageCase?.id}
                  className={`
                    p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow
                    ${
                      triageCase?.priority === "high"
                        ? "border-l-4 border-l-red-500"
                        : triageCase?.priority === "medium"
                        ? "border-l-4 border-l-yellow-500"
                        : "border-l-4 border-l-green-500"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="flex items-center font-medium text-gray-900">
                        <span
                          className={`block w-2 h-2 rounded-full mr-2 ${getPriorityColor(
                            triageCase?.priority
                          )}`}
                        ></span>
                        {triageCase?.patientName}
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        Arrived: {formatDateTime(triageCase?.arrivalTime)}
                      </p>
                    </div>
                    <Badge
                      text={triageCase?.priority}
                      variant={
                        triageCase?.priority === "high"
                          ? "danger"
                          : triageCase?.priority === "medium"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="font-medium text-gray-700 text-sm">
                      {triageCase?.chiefComplaint}
                    </p>
                  </div>

                  <div className="gap-2 grid grid-cols-2 mt-3 text-xs">
                    <div className="flex items-center">
                      <Heart className="mr-1 w-3 h-3 text-red-500" />
                      <span className="text-gray-700">
                        HR: {triageCase?.vital_signs?.heartRate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="mr-1 w-3 h-3 text-blue-500" />
                      <span className="text-gray-700">
                        BP: {triageCase?.vital_signs?.bloodPressure}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        Temp: {triageCase?.vital_signs?.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        O₂: {triageCase?.vital_signs?.oxygenSaturation}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="primary" size="sm" fullWidth>
                      Begin Treatment
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <Clock className="mx-auto w-10 h-10 text-gray-300" />
                <p className="mt-2 font-medium text-gray-900 text-sm">
                  No waiting cases
                </p>
                <p className="text-gray-500 text-xs">
                  All patients are being attended to
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="bg-yellow-50 border-yellow-100 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-yellow-900 text-lg">
                <AlertTriangle className="mr-2 w-5 h-5 text-yellow-700" />
                In Progress
              </CardTitle>
              <Badge
                text={`${groupedCases["in-progress"].length} cases`}
                variant="warning"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases["in-progress"].length > 0 ? (
              groupedCases["in-progress"].map((triageCase) => (
                <div
                  key={triageCase?.id}
                  className={`
                    p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow
                    ${
                      triageCase?.priority === "high"
                        ? "border-l-4 border-l-red-500"
                        : triageCase?.priority === "medium"
                        ? "border-l-4 border-l-yellow-500"
                        : "border-l-4 border-l-green-500"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="flex items-center font-medium text-gray-900">
                        <span
                          className={`block w-2 h-2 rounded-full mr-2 ${getPriorityColor(
                            triageCase?.priority
                          )}`}
                        ></span>
                        {triageCase?.patientName}
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        Arrived: {formatDateTime(triageCase?.arrivalTime)}
                      </p>
                    </div>
                    <Badge
                      text={triageCase?.priority}
                      variant={
                        triageCase?.priority === "high"
                          ? "danger"
                          : triageCase?.priority === "medium"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="font-medium text-gray-700 text-sm">
                      {triageCase?.chiefComplaint}
                    </p>
                  </div>

                  <div className="gap-2 grid grid-cols-2 mt-3 text-xs">
                    <div className="flex items-center">
                      <Heart className="mr-1 w-3 h-3 text-red-500" />
                      <span className="text-gray-700">
                        HR: {triageCase?.vital_signs?.heartRate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="mr-1 w-3 h-3 text-blue-500" />
                      <span className="text-gray-700">
                        BP: {triageCase?.vital_signs?.bloodPressure}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        Temp: {triageCase?.vital_signs?.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        O₂: {triageCase?.vital_signs?.oxygenSaturation}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="success" size="sm" fullWidth>
                      Complete Treatment
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <AlertTriangle className="mx-auto w-10 h-10 text-gray-300" />
                <p className="mt-2 font-medium text-gray-900 text-sm">
                  No active cases
                </p>
                <p className="text-gray-500 text-xs">
                  No patients are currently being treated
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader className="bg-green-50 border-green-100 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-green-900 text-lg">
                <User className="mr-2 w-5 h-5 text-green-700" />
                Completed
              </CardTitle>
              <Badge
                text={`${groupedCases.completed.length} cases`}
                variant="success"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases.completed.length > 0 ? (
              groupedCases.completed.map((triageCase) => (
                <div
                  key={triageCase?.id}
                  className="shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {triageCase?.patientName}
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        Arrived: {formatDateTime(triageCase?.arrivalTime)}
                      </p>
                    </div>
                    <Badge
                      text={triageCase?.priority}
                      variant={
                        triageCase?.priority === "high"
                          ? "danger"
                          : triageCase?.priority === "medium"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="font-medium text-gray-700 text-sm">
                      {triageCase?.chiefComplaint}
                    </p>
                  </div>

                  <div className="mt-3">
                    <Badge text="Completed" variant="success" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <User className="mx-auto w-10 h-10 text-gray-300" />
                <p className="mt-2 font-medium text-gray-900 text-sm">
                  No completed cases
                </p>
                <p className="text-gray-500 text-xs">
                  Cases will appear here once completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriageList;
