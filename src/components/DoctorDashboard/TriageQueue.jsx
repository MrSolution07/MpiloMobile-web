import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, UserMinus } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "../ui";
import { formatDateTime } from "../../utils";

const TriageQueue = () => {
  const [triageCases, setTriageCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch in-progress triage cases from Supabase
  const fetchInProgressTriageCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('triage_cases')
        .select('*')
        .eq('status', 'in-progress')
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
    fetchInProgressTriageCases();

    const subscription = supabase
      .channel('triage_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'triage_cases'
      }, (payload) => {
        // Only update if the case is in-progress
        if (payload.eventType === 'INSERT' && payload.new.status === 'in-progress') {
          setTriageCases(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status === 'in-progress') {
            setTriageCases(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
          } else {
            // Remove if status changed from in-progress to something else
            setTriageCases(prev => prev.filter(c => c.id !== payload.new.id));
          }
        } else if (payload.eventType === 'DELETE') {
          setTriageCases(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error loading triage cases: {error}</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center font-semibold text-gray-900 text-lg">
          <AlertTriangle className="mr-2 w-5 h-5 text-yellow-600" />
          Triage Queue
        </CardTitle>
        <Badge text={`${triageCases.length} active`} variant="warning" />
      </CardHeader>

      <CardContent className="flex-grow">
        {triageCases.length > 0 ? (
          <div className="space-y-4">
            {triageCases.slice(0, 3).map((triage) => (
              <div
                key={triage.id}
                className="flex items-start hover:bg-gray-50 p-3 border border-gray-100 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <div
                    className={`
                    rounded-full w-3 h-3
                    ${
                      triage.priority === "high"
                        ? "bg-red-500"
                        : triage.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  `}
                  ></div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {triage.first_name} {triage.last_name}
                    </p>
                    <Badge
                      text={triage.priority}
                      variant={
                        triage.priority === "high"
                          ? "danger"
                          : triage.priority === "medium"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </div>
                  <p className="mt-1 text-gray-700 text-xs truncate">
                    {triage.chief_complaint}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-500 text-xs">
                      Arrived: {formatDateTime(triage.arrival_time)}
                    </p>
                    <p className="font-medium text-xs">
                      In Progress
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <UserMinus className="mx-auto w-10 h-10 text-gray-300" />
            <p className="mt-2 font-medium text-gray-900 text-sm">
              No active triage cases
            </p>
            <p className="text-gray-500 text-xs">
              Emergency room is currently clear
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="justify-center w-full text-yellow-600 hover:text-yellow-800"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          <Link to="/dashboard/triage">View all triage cases</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TriageQueue;