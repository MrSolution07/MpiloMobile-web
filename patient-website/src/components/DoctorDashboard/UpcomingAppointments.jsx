import { Link } from "react-router-dom";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "../ui";
import { formatTime } from "../../utils";

const UpcomingAppointments = ({ appointments }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center font-semibold text-gray-900 text-lg">
          <Calendar className="mr-2 w-5 h-5 text-blue-600" />
          Today's Appointments
        </CardTitle>
        <Badge text={`${appointments.length} total`} variant="primary" />
      </CardHeader>

      <CardContent className="flex-grow">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start hover:bg-gray-50 p-3 border border-gray-100 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="flex flex-col justify-center items-center bg-blue-100 p-2 rounded-lg w-12 h-12 text-blue-800 text-center">
                    <span className="font-medium text-xs">
                      {formatTime(appointment.time).split(" ")[0]}
                    </span>
                    <span className="text-xs">
                      {formatTime(appointment.time).split(" ")[1]}
                    </span>
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {appointment.patientName}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    {appointment.type} ({appointment.duration} min)
                  </p>
                  {appointment.notes && (
                    <p className="mt-1 text-gray-500 text-xs truncate">
                      {appointment.notes}
                    </p>
                  )}
                </div>

                <div className="ml-2">
                  <Badge
                    text={appointment.status}
                    variant={
                      appointment.status === "scheduled"
                        ? "primary"
                        : appointment.status === "completed"
                        ? "success"
                        : appointment.status === "cancelled"
                        ? "danger"
                        : "neutral"
                    }
                    size="small"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Clock className="mx-auto w-10 h-10 text-gray-300" />
            <p className="mt-2 font-medium text-gray-900 text-sm">
              No appointments today
            </p>
            <p className="text-gray-500 text-xs">Enjoy your free time!</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="justify-center w-full text-blue-600 hover:text-blue-800"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          <Link to="/dashboard/appointments">View all appointments</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingAppointments;
