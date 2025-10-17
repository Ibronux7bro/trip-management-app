import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard stats');
      const json = await res.json();
      return json.data;
    },
    // Fallback to default values if loading or error
    placeholderData: {
      drivers: { total: 0, available: 0, onTrip: 0, offline: 0 },
      vehicles: { total: 0, available: 0, onTrip: 0, maintenance: 0 },
      trips: { total: 0, inProgress: 0, scheduled: 0, completed: 0, delayed: 0 },
      routes: { total: 0, active: 0 },
      orders: { total: 0, pending: 0, completed: 0, inProgress: 0 },
    },
  });

  return data || {
    drivers: { total: 0, available: 0, onTrip: 0, offline: 0 },
    vehicles: { total: 0, available: 0, onTrip: 0, maintenance: 0 },
    trips: { total: 0, inProgress: 0, scheduled: 0, completed: 0, delayed: 0 },
    routes: { total: 0, active: 0 },
    orders: { total: 0, pending: 0, completed: 0, inProgress: 0 },
  };
};
