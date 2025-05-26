import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, UserMinus } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDateTime } from '../../utils/dateUtils';

const TriageQueue = ({ triageCases }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
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
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className={`
                    rounded-full w-3 h-3
                    ${triage.priority === 'high' ? 'bg-red-500' : 
                      triage.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                  `}></div>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {triage.patientName}
                    </p>
                    <Badge 
                      text={triage.priority} 
                      variant={
                        triage.priority === 'high' ? 'danger' : 
                        triage.priority === 'medium' ? 'warning' : 'success'
                      } 
                      size="small" 
                    />
                  </div>
                  <p className="text-xs text-gray-700 mt-1 truncate">
                    {triage.chiefComplaint}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Arrived: {formatDateTime(triage.arrivalTime)}
                    </p>
                    <p className="text-xs font-medium">
                      {triage.status === 'waiting' ? 'Waiting' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <UserMinus className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No active triage cases</p>
            <p className="text-xs text-gray-500">Emergency room is currently clear</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center text-yellow-600 hover:text-yellow-800"
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
        >
          <Link to="/triage">View all triage cases</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TriageQueue;