import { Drivers } from '@/constants/drivers';
import { TripsMock } from '@/constants/trips';
import { Vehicles } from '@/constants/vehicles';
import { SpeedReportsMock } from '@/constants/speed-reports';
import { IdleReportsMock } from '@/constants/idle-reports';
import { FuelInfoMock } from '@/constants/fuel-reports';
import { VehicleMaintenanceMock } from '@/constants/maintenance-reports';

// Utility function to check if date is within range
const isDateInRange = (
  date: string,
  startDate: Date,
  endDate: Date
): boolean => {
  const checkDate = new Date(date);
  return checkDate >= startDate && checkDate <= endDate;
};

export const ReportsService = {
  // Trip Activity Reports
  getTripActivityData: (startDate: Date, endDate: Date) => {
    const tripsInRange = TripsMock.filter(
      (trip) =>
        trip.created_at && isDateInRange(trip.created_at, startDate, endDate)
    ).map((trip) => {
      const driver = Drivers.find((d) => d.id === trip.driver);
      const vehicle = Vehicles.find((v) => v.id === trip.vehicle);

      return {
        tripId: trip.id,
        driverName: driver?.fullname || 'Unknown',
        vehicleNumber: vehicle?.vehicle_number || 'Unknown',
        startTime: trip.start_time,
        endTime: trip.end_time,
        status: trip.end_time
          ? 'Completed'
          : trip.start_time
            ? 'In Progress'
            : 'Scheduled',
        distanceTravelled: trip.distance_travelled || 0,
        totalIdleTime: trip.total_idle_time || 0,
        scheduledStartTime: trip.scheduled_start_time,
        isDelayed:
          trip.start_time && trip.scheduled_start_time
            ? new Date(trip.start_time) > new Date(trip.scheduled_start_time)
            : false,
      };
    });

    return tripsInRange;
  },

  // Trip Alerts Reports
  getTripAlertsData: (startDate: Date, endDate: Date) => {
    // Speed Violations
    const speedViolations = SpeedReportsMock.filter(
      (report) =>
        report.timestamp && isDateInRange(report.timestamp, startDate, endDate)
    ).map((report) => {
      const trip = TripsMock.find((t) => t.id === report.trip);
      const driver = trip ? Drivers.find((d) => d.id === trip.driver) : null;
      const vehicle = trip ? Vehicles.find((v) => v.id === trip.vehicle) : null;

      return {
        alertId: report.id,
        tripId: report.trip,
        type: 'Speed Violation',
        driverName: driver?.fullname || 'Unknown',
        vehicleNumber: vehicle?.vehicle_number || 'Unknown',
        speed: report.speed,
        timestamp: report.timestamp,
        location: `${report.latitude}, ${report.longitude}`,
        duration:
          report.start_speed_time && report.end_speed_time
            ? (new Date(report.end_speed_time).getTime() -
                new Date(report.start_speed_time).getTime()) /
              60000
            : 0,
      };
    });

    // Idle Time Alerts
    const idleAlerts = IdleReportsMock.filter(
      (report) =>
        report.timestamp && isDateInRange(report.timestamp, startDate, endDate)
    ).map((report) => {
      const trip = TripsMock.find((t) => t.id === report.trip);
      const driver = trip ? Drivers.find((d) => d.id === trip.driver) : null;
      const vehicle = trip ? Vehicles.find((v) => v.id === trip.vehicle) : null;

      return {
        alertId: report.id,
        tripId: report.trip,
        type: 'Extended Idle Time',
        driverName: driver?.fullname || 'Unknown',
        vehicleNumber: vehicle?.vehicle_number || 'Unknown',
        timestamp: report.timestamp,
        location: `${report.latitude}, ${report.longitude}`,
        duration:
          report.start_idle_time && report.end_idle_time
            ? (new Date(report.end_idle_time).getTime() -
                new Date(report.start_idle_time).getTime()) /
              60000
            : 0,
      };
    });

    return [...speedViolations, ...idleAlerts];
  },

  // Fuel and Maintenance Reports
  getFuelMaintenanceData: (startDate: Date, endDate: Date) => {
    // Fuel Reports
    const fuelReports = FuelInfoMock.filter(
      (report) =>
        report.fuel_filled_time &&
        isDateInRange(report.fuel_filled_time, startDate, endDate)
    ).map((report) => {
      const trip = TripsMock.find((t) => t.id === report.trip);
      const vehicle = trip ? Vehicles.find((v) => v.id === trip.vehicle) : null;
      const driver = trip ? Drivers.find((d) => d.id === trip.driver) : null;

      return {
        reportId: report.id,
        type: 'Fuel',
        tripId: report.trip,
        driverName: driver?.fullname || 'Unknown',
        vehicleNumber: vehicle?.vehicle_number || 'Unknown',
        vehicleType: vehicle?.vehicle_type || 'Unknown',
        amount: report.fuel_cost || 0,
        quantity: report.fuel_filled || 0,
        odometer: report.odometer || 0,
        timestamp: report.fuel_filled_time,
        billNumber: report.bill_number,
      };
    });

    // Maintenance Reports
    const maintenanceReports = VehicleMaintenanceMock.filter(
      (report) =>
        report.maintenance_time &&
        isDateInRange(report.maintenance_time, startDate, endDate)
    ).map((report) => {
      const trip = TripsMock.find((t) => t.id === report.trip);
      const vehicle = trip ? Vehicles.find((v) => v.id === trip.vehicle) : null;
      const driver = trip ? Drivers.find((d) => d.id === trip.driver) : null;

      return {
        reportId: report.id,
        type: 'Maintenance',
        tripId: report.trip,
        driverName: driver?.fullname || 'Unknown',
        vehicleNumber: vehicle?.vehicle_number || 'Unknown',
        vehicleType: vehicle?.vehicle_type || 'Unknown',
        serviceType: report.service_type,
        amount: report.bill_amount || 0,
        odometer: report.odometer || 0,
        timestamp: report.maintenance_time,
        serviceCenter: report.service_center_name,
        billNumber: report.bill_number,
      };
    });

    return {
      fuelReports,
      maintenanceReports,
      summary: {
        totalFuelCost: fuelReports.reduce(
          (sum, report) => sum + report.amount,
          0
        ),
        totalMaintenanceCost: maintenanceReports.reduce(
          (sum, report) => sum + report.amount,
          0
        ),
        totalFuelQuantity: fuelReports.reduce(
          (sum, report) => sum + report.quantity,
          0
        ),
        maintenanceCount: maintenanceReports.length,
        fuelTransactions: fuelReports.length,
      },
    };
  },
};
