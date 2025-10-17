import { EnhancedDriver, DriverStatus } from '@/types';
import { getStatusColor } from '@/utils/getStatusColor';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronUp, ChevronDown, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const getSafetyScoreColor = (value: number): string => {
  if (value >= 90) return 'text-success-600';
  if (value >= 70) return 'text-warning-600';
  return 'text-destructive-600';
};

export const columns: ColumnDef<EnhancedDriver>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border border-border"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border border-border mb-2"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>ID</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>Driver Name</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => {
      const fullname = row.getValue<string>('fullname');
      const initials = fullname
        .split(' ')
        .map((n) => n[0])
        .join('');

      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {initials}
            </span>
          </div>
          <span className="font-medium">{fullname}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>Status</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.getValue('status'))}>
        {row.getValue('status')}
      </Badge>
    ),
    filterFn: (row, columnId, filterValue: DriverStatus[]) => {
      if (!filterValue.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    id: 'currentVehicle',
    accessorFn: (row) => row.currentVehicle?.id,
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>Current Vehicle</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => {
      const vehicleId = row.original.currentVehicle?.id;
      return vehicleId ? (
        <span className="font-medium">{vehicleId}</span>
      ) : (
        <span className="text-muted-foreground">Unassigned</span>
      );
    },
  },
  {
    accessorKey: 'metrics.safetyMetrics.safetyRating',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>Safety Score</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => {
      const safetyMetrics = row.original.metrics?.safetyMetrics;
      const score = safetyMetrics?.safetyRating;

      if (score == null) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      return (
        <span className={`font-medium ${getSafetyScoreColor(score)}`}>
          {score.toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: 'metrics.tripMetrics.onTimeRate',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>On-Time Rate</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => {
      const onTimeRate = row.original.metrics?.tripMetrics?.onTimeRate;

      if (onTimeRate == null) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      return <span className="font-medium">{onTimeRate.toFixed(1)}%</span>;
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <div className="flex items-center cursor-pointer">
          <span>Region</span>
          {sorted &&
            (sorted === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue('state')}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Driver</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive-600">
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
