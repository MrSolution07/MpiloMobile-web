import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
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
import { formatDateTime } from "../../utils";

const TriageList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [triageCases, setTriageCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingCases, setUpdatingCases] = useState({});
  const navigate = useNavigate();

  // Fetch data from Supabase
  const fetchTriageCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('triage_cases')
        .select('*')
        .order('arrival_time', { ascending: true });

      if (error) throw error;
      setTriageCases(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchTriageCases();

    const subscription = supabase
      .channel('triage_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'triage_cases'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTriageCases(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setTriageCases(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
          setUpdatingCases(prev => {
            const newState = {...prev};
            delete newState[payload.new.id];
            return newState;
          });
        } else if (payload.eventType === 'DELETE') {
          setTriageCases(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  // Update case status in database
  const updateCaseStatus = async (caseId, newStatus) => {
    try {
      setUpdatingCases(prev => ({ ...prev, [caseId]: true }));
      setTriageCases(prev => 
        prev.map(caseItem => 
          caseItem.id === caseId 
            ? { ...caseItem, status: newStatus } 
            : caseItem
        )
      );
      
      const { error } = await supabase
        .from('triage_cases')
        .update({ status: newStatus })
        .eq('id', caseId);

      if (error) throw error;
      
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
      fetchTriageCases();
    } finally {
      setUpdatingCases(prev => {
        const newState = {...prev};
        delete newState[caseId];
        return newState;
      });
    }
  };

  // Handle complete treatment - navigate to NewRecord with patient data
  const handleCompleteTreatment = (triageCase) => {
    navigate('/dashboard/records/new', {
      state: {
        patientData: {
          id: triageCase.id,
          firstName: triageCase.first_name,
          lastName: triageCase.last_name,
          vitalSigns: {
            heartRate: triageCase.heart_rate,
            bloodPressure: triageCase.blood_pressure,
            temperature: triageCase.temperature,
            oxygenSaturation: triageCase.oxygen_saturation,
            respiratoryRate: triageCase.respiratory_rate || 0
          }
        },
        fromTriage: true // Flag to indicate coming from triage
      }
    });
  };

  // Filter triage cases
  const filteredCases = triageCases.filter((triageCase) => {
    const patientName = `${triageCase.first_name} ${triageCase.last_name}`.toLowerCase();
    const matchesSearch =
      patientName.includes(searchQuery.toLowerCase()) ||
      (triageCase.chief_complaint && triageCase.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || triageCase.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || triageCase.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort cases by priority and arrival time
  const sortedCases = [...filteredCases].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || 
           new Date(a.arrival_time) - new Date(b.arrival_time);
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
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading triage cases: {error}</p>
      </div>
    );
  }

  // Case Card Component
  const CaseCard = ({ triageCase, action, actionText, actionVariant = 'primary', showStatus = false }) => (
    <div className={`p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative ${
      triageCase.priority === "high"
        ? "border-l-4 border-l-red-500"
        : triageCase.priority === "medium"
        ? "border-l-4 border-l-yellow-500"
        : "border-l-4 border-l-green-500"
    }`}>
      {/* Loading overlay */}
      {updatingCases[triageCase.id] && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <p className="flex items-center font-medium text-gray-900">
            <span
              className={`block w-2 h-2 rounded-full mr-2 ${getPriorityColor(
                triageCase.priority
              )}`}
            ></span>
            {triageCase.first_name} {triageCase.last_name}
          </p>
          <p className="mt-1 text-gray-500 text-sm">
            Arrived: {formatDateTime(triageCase.arrival_time)}
          </p>
        </div>
        <Badge
          text={triageCase.priority}
          variant={
            triageCase.priority === "high"
              ? "danger"
              : triageCase.priority === "medium"
              ? "warning"
              : "success"
          }
          size="small"
        />
      </div>

      <div className="mt-3">
        <p className="font-medium text-gray-700 text-sm">
          {triageCase.chief_complaint}
        </p>
      </div>

      <div className="gap-2 grid grid-cols-2 mt-3 text-xs">
        <div className="flex items-center">
          <Heart className="mr-1 w-3 h-3 text-red-500" />
          <span className="text-gray-700">
            HR: {triageCase.heart_rate}
          </span>
        </div>
        <div className="flex items-center">
          <Activity className="mr-1 w-3 h-3 text-blue-500" />
          <span className="text-gray-700">
            BP: {triageCase.blood_pressure}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">
            Temp: {triageCase.temperature}°C
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">
            O₂: {triageCase.oxygen_saturation}%
          </span>
        </div>
      </div>

      {showStatus && (
        <div className="mt-3">
          <Badge text="Completed" variant="success" />
        </div>
      )}

      {action && (
        <div className="mt-4">
          <Button 
            variant={actionVariant} 
            size="sm" 
            fullWidth
            onClick={action}
            disabled={updatingCases[triageCase.id]}
          >
            {updatingCases[triageCase.id] ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              actionText
            )}
          </Button>
        </div>
      )}
    </div>
  );

  // Empty State Component
  const EmptyState = ({ icon: Icon, message }) => (
    <div className="py-6 text-center">
      <Icon className="mx-auto w-10 h-10 text-gray-300" />
      <p className="mt-2 font-medium text-gray-900 text-sm">
        {message}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header and controls */}
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
                {["all", "waiting", "in-progress", "completed"].map((status) => (
                  <button
                    key={status}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      statusFilter === status
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {["all", "high", "medium", "low"].map((priority) => (
                  <button
                    key={priority}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      priorityFilter === priority
                        ? priority === "high"
                          ? "bg-red-100 text-red-800"
                          : priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : priority === "low"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setPriorityFilter(priority)}
                  >
                    {priority === "all" ? "All" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Triage Board */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        {/* Waiting Column */}
        <Card>
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-blue-900 text-lg">
                <Clock className="mr-2 w-5 h-5 text-blue-700" />
                Waiting
              </CardTitle>
              <Badge text={`${groupedCases.waiting.length} cases`} variant="primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases.waiting.length > 0 ? (
              groupedCases.waiting.map((triageCase) => (
                <CaseCard 
                  key={triageCase.id}
                  triageCase={triageCase}
                  action={() => updateCaseStatus(triageCase.id, 'in-progress')}
                  actionText="Begin Treatment"
                  actionVariant="primary"
                />
              ))
            ) : (
              <EmptyState icon={Clock} message="No waiting cases" />
            )}
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card>
          <CardHeader className="bg-yellow-50 border-yellow-100 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-yellow-900 text-lg">
                <AlertTriangle className="mr-2 w-5 h-5 text-yellow-700" />
                In Progress
              </CardTitle>
              <Badge text={`${groupedCases["in-progress"].length} cases`} variant="warning" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases["in-progress"].length > 0 ? (
              groupedCases["in-progress"].map((triageCase) => (
                <CaseCard 
                  key={triageCase.id}
                  triageCase={triageCase}
                  action={() => handleCompleteTreatment(triageCase)}
                  actionText="Complete Treatment"
                  actionVariant="success"
                />
              ))
            ) : (
              <EmptyState icon={AlertTriangle} message="No active cases" />
            )}
          </CardContent>
        </Card>

        {/* Completed Column */}
        <Card>
          <CardHeader className="bg-green-50 border-green-100 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-green-900 text-lg">
                <User className="mr-2 w-5 h-5 text-green-700" />
                Completed
              </CardTitle>
              <Badge text={`${groupedCases.completed.length} cases`} variant="success" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {groupedCases.completed.length > 0 ? (
              groupedCases.completed.map((triageCase) => (
                <CaseCard 
                  key={triageCase.id}
                  triageCase={triageCase}
                  showStatus={true}
                />
              ))
            ) : (
              <EmptyState icon={User} message="No completed cases" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriageList;