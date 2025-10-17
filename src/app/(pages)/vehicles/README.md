# Vehicle Management System

This module provides a comprehensive vehicle management system for the "Nukhbat Al-Naql" (نخبة النقل) fleet management platform.

## Features

### 📋 Vehicle List (`/vehicles`)
- Display all vehicles in a paginated table
- Search by plate number
- Filter by status (Available, Maintenance, Out of Service) and vehicle type (Car, Truck, Bus)
- Quick actions: View details, Edit vehicle
- Add new vehicle button

### ➕ Add New Vehicle (`/vehicles/new`)
- Form with all required fields: plateNumber, vehicleType, model, year, status
- Client-side validation with real-time error messages
- Plate number format validation (ABC-1234)
- Year validation (1900 to current year + 1)
- Success/error toast notifications

### 👁️ Vehicle Details (`/vehicles/[id]`)
- Complete vehicle information display
- Maintenance history table with cost tracking
- Accident logs with severity indicators
- Quick action buttons: Edit, Mark as Maintenance, Archive
- Statistics sidebar with maintenance costs and vehicle age

### ✏️ Edit Vehicle (`/vehicles/[id]/edit`)
- Pre-filled form with existing vehicle data
- Same validation as add form
- Update functionality with optimistic UI updates
- Navigation back to vehicle details after successful update

## API Endpoints

The system uses the following REST API endpoints:

### `GET /api/vehicles`
**Purpose**: Fetch paginated list of vehicles with optional filtering
**Query Parameters**:
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10)
- `plateNumber` (string): Filter by plate number (partial match)
- `status` (string): Filter by status (Available, Maintenance, Out of Service)
- `vehicleType` (string): Filter by type (Car, Truck, Bus)

**Response**:
```json
{
  "success": true,
  "data": [Vehicle[]],
  "total": number,
  "page": number,
  "limit": number
}
```

### `POST /api/vehicles`
**Purpose**: Create a new vehicle
**Body**: VehicleFormData object
**Response**: `{ success: boolean, data: Vehicle, message: string }`

### `GET /api/vehicles/[id]`
**Purpose**: Get vehicle details including maintenance and accident logs
**Response**: `{ success: boolean, data: Vehicle }`

### `PUT /api/vehicles/[id]`
**Purpose**: Update vehicle information
**Body**: VehicleFormData object
**Response**: `{ success: boolean, data: Vehicle, message: string }`

### `DELETE /api/vehicles/[id]`
**Purpose**: Archive vehicle (sets status to "Out of Service")
**Response**: `{ success: boolean, message: string }`

## Data Types

### Vehicle
```typescript
interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: 'Car' | 'Truck' | 'Bus';
  model: string;
  year: number;
  status: 'Available' | 'Maintenance' | 'Out of Service';
  createdAt: string;
  updatedAt: string;
  maintenanceLogs?: MaintenanceLog[];
  accidentLogs?: AccidentLog[];
}
```

### MaintenanceLog
```typescript
interface MaintenanceLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  nextDue?: string;
  createdAt: string;
}
```

### AccidentLog
```typescript
interface AccidentLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
  createdAt: string;
}
```

## Technical Implementation

### Frontend Technologies
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React Query** for data fetching and caching
- **shadcn/ui** components for consistent UI
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Key Features
- **RTL Support**: Full Arabic/RTL layout support
- **Responsive Design**: Mobile-first responsive design
- **Accessibility**: Proper labels, keyboard navigation, ARIA attributes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading indicators for all async operations
- **Form Validation**: Client-side validation with real-time feedback
- **Toast Notifications**: Success/error notifications for user actions

### Mock Data
Currently uses in-memory mock data for development. In production, this would be replaced with:
- Database integration (PostgreSQL, MongoDB, etc.)
- Authentication and authorization
- File upload for vehicle images
- Integration with maintenance scheduling systems
- Real-time notifications for status changes

## Assumptions

1. **Plate Number Format**: Saudi Arabia format (ABC-1234) - 3 letters, dash, 4 numbers
2. **Authentication**: No authentication implemented in mock version
3. **Permissions**: All users have full CRUD access in current implementation
4. **Data Persistence**: Mock data resets on server restart
5. **File Uploads**: Vehicle images not implemented in current version
6. **Notifications**: Toast notifications only, no email/SMS integration yet

## Future Enhancements

- [ ] Vehicle image upload and gallery
- [ ] Maintenance scheduling and reminders
- [ ] Integration with booking system
- [ ] Driver assignment to vehicles
- [ ] GPS tracking integration
- [ ] Fuel consumption tracking
- [ ] Insurance and registration management
- [ ] Bulk operations (import/export)
- [ ] Advanced reporting and analytics
- [ ] Mobile app support
