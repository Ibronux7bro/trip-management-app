import DriverAnalysisCard from '@/app/(pages)/components/driver-analytics';
import FleetCard from '@/app/(pages)/components/fleets';
import PerformanceCard from '@/app/(pages)/components/performance-card';
import LocationCard from '@/app/(pages)/components/location-detail';
import TripTrackerCard from '@/app/(pages)/components/trip-tracker';

export default function DashboardHome() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-4 rounded-md">
        <DriverAnalysisCard />
        <PerformanceCard />
        <LocationCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-md">
        <FleetCard />
        <TripTrackerCard />
      </div>
    </div>
  );
}
