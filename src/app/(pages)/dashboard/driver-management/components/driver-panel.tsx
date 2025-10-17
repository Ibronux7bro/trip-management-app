// Types

import { EnhancedDriver } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Car, MapPin, Shield, LineChart, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import { getInitials } from '@/utils/getInitials';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/utils/getStatusColor';

interface DriverDetailsPanelProps {
  selectedDriver?: EnhancedDriver | null;
}

// DriverDetailsPanel Component
const DriverDetailsPanel: React.FC<DriverDetailsPanelProps> = ({
  selectedDriver,
}) => {
  if (!selectedDriver) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a driver to view details
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-6 overflow-y-auto">
      {/* Driver Header */}
      <div className="flex flex-col items-center">
        {/* Profile Picture and Initials */}
        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-3xl font-semibold text-primary-500">
            {getInitials(selectedDriver.fullname)}
          </span>
        </div>
        {/* Driver Details */}
        <div className="flex flex-col items-center space-y-2 py-3 w-full">
          <h3 className="text-lg font-semibold">{selectedDriver.fullname}</h3>
          <Badge className={getStatusColor(selectedDriver.status)}>
            {selectedDriver.status}
          </Badge>
        </div>
      </div>

      <Separator orientation="horizontal" />

      {/* Quick Stats */}
      <div className="text-nowrap">
        <h4 className="text-sm font-semibold mb-4">Performance Overview</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-primary-500">
              {selectedDriver?.metrics?.safetyMetrics?.safetyRating}%
            </div>
            <div className="text-xs text-muted-foreground">Safety Score</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-primary-500">
              {selectedDriver.metrics.tripMetrics.onTimeRate}%
            </div>
            <div className="text-xs text-muted-foreground">On-Time Rate</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-primary-500">
              {selectedDriver.metrics.timeManagement.breakTimeCompliance}%
            </div>
            <div className="text-xs text-muted-foreground">
              Break Compliance
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle & Trip Info */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Current Status</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Current Vehicle</span>
            </div>
            <span className="text-sm font-medium">
              {selectedDriver.currentVehicle?.id || 'Unassigned'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Region</span>
            </div>
            <span className="text-sm font-medium">{selectedDriver.state}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">License</span>
            </div>
            <span className="text-sm font-medium">
              {selectedDriver.license_number}
            </span>
          </div>
        </div>
      </div>

      {/* Current Trip */}
      {/* {selectedDriver.currentTrip && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold">
                Active Trip {selectedDriver.currentTrip.id}
              </h4>
              <div className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                In Progress
              </div>
            </div>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="speed" stroke="#7367F0" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )} 
      */}
      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-4">
          {selectedDriver.recentActivity.length <= 0 ? (
            <p className="text-center text-muted-foreground text-sm tracking-tight leading-3">
              No recent activity found!
            </p>
          ) : (
            selectedDriver.recentActivity.slice(0, 4).map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Activity className="h-4 w-4 text-primary-500 mt-1" />
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsPanel;
