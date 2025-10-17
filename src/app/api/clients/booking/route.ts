import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for booking data
const bookingSchema = z.object({
  fromCity: z.string().min(1, 'Departure city is required'),
  toCity: z.string().min(1, 'Destination city is required'),
  vehicleType: z.enum(['small', 'medium', 'large', 'truck'], {
    errorMap: () => ({ message: 'Invalid vehicle type' })
  }),
  clientId: z.string().min(1, 'Client ID is required'),
  notes: z.string().optional(),
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  packageWeight: z.number().optional(),
  packageDimensions: z.string().optional(),
  senderName: z.string().min(1, 'Sender name is required'),
  senderPhone: z.string().min(10, 'Invalid sender phone number'),
  receiverName: z.string().min(1, 'Receiver name is required'),
  receiverPhone: z.string().min(10, 'Invalid receiver phone number'),
  receiverAddress: z.string().min(1, 'Receiver address is required'),
});

// Mock database - In a real application, use a real database
let bookings: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the booking data
    const validationResult = bookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid booking data',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const bookingData = validationResult.data;
    
    // Generate booking ID and create booking record
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBooking = {
      id: bookingId,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedPrice: calculatePrice(bookingData.fromCity, bookingData.toCity, bookingData.vehicleType),
      trackingNumber: `TR-${Date.now()}`,
    };

    // Save to mock database
    bookings.push(newBooking);
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your booking request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json({
        success: false,
        message: 'Client ID is required'
      }, { status: 400 });
    }

    // Filter bookings by client ID
    const clientBookings = bookings.filter(booking => booking.clientId === clientId);
    
    return NextResponse.json({
      success: true,
      data: clientBookings,
      total: clientBookings.length
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching bookings'
    }, { status: 500 });
  }
}

// Helper function to calculate price based on distance and vehicle type
function calculatePrice(fromCity: string, toCity: string, vehicleType: string): number {
  const basePrices = {
    small: 50,
    medium: 75,
    large: 100,
    truck: 150
  };
  
  // Mock distance calculation - In a real application, use a distance API
  const cityDistances: { [key: string]: number } = {
    'Riyadh-Jeddah': 950,
    'Riyadh-Dammam': 400,
    'Jeddah-Dammam': 1350,
    'Riyadh-Makkah': 870,
    'Jeddah-Makkah': 80,
  };
  
  const distanceKey = `${fromCity}-${toCity}`;
  const reverseKey = `${toCity}-${fromCity}`;
  const distance = cityDistances[distanceKey] || cityDistances[reverseKey] || 500;
  
  const basePrice = basePrices[vehicleType as keyof typeof basePrices] || 75;
  const pricePerKm = 0.5;
  
  return Math.round(basePrice + (distance * pricePerKm));
}