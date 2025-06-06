import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, UserMinus } from "lucide-react";
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

const TriageQueue = ({ triageCases }) => {
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
                      {triage.patientName}
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
                    {triage.chiefComplaint}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-500 text-xs">
                      Arrived: {formatDateTime(triage.arrivalTime)}
                    </p>
                    <p className="font-medium text-xs">
                      {triage.status === "waiting" ? "Waiting" : "In Progress"}
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
