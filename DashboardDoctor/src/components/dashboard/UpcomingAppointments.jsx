import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatTime } from '../../utils/dateUtils';

const UpcomingAppointments = ({ appointments }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
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
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-blue-100 text-blue-800 rounded-lg p-2 w-12 h-12 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-medium">
                      {formatTime(appointment.time).split(' ')[0]}
                    </span>
                    <span className="text-xs">
                      {formatTime(appointment.time).split(' ')[1]}
                    </span>
                  </div>
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {appointment.type} ({appointment.duration} min)
                  </p>
                  {appointment.notes && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {appointment.notes}
                    </p>
                  )}
                </div>
                
                <div className="ml-2">
                  <Badge 
                    text={appointment.status} 
                    variant={
                      appointment.status === 'scheduled' ? 'primary' : 
                      appointment.status === 'completed' ? 'success' : 
                      appointment.status === 'cancelled' ? 'danger' : 'neutral'
                    } 
                    size="small" 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Clock className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No appointments today</p>
            <p className="text-xs text-gray-500">Enjoy your free time!</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center text-blue-600 hover:text-blue-800"
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
        >
          <Link to="/appointments">View all appointments</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingAppointments;