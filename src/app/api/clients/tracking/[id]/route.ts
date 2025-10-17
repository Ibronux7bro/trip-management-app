import { NextRequest, NextResponse } from 'next/server';

// Mock database for tracking data
const trackingData: { [key: string]: any } = {};

// Initialize some mock tracking data
const initializeMockData = () => {
  if (Object.keys(trackingData).length === 0) {
    trackingData['BK-1234567890'] = {
      orderId: 'BK-1234567890',
      trackingNumber: 'TR-1234567890',
      status: 'in_transit',
      currentLocation: {
        lat: 24.7136,
        lng: 46.6753,
        address: 'Riyadh, Kingdom of Saudi Arabia'
      },
      route: [
        { lat: 24.7136, lng: 46.6753, timestamp: '2024-01-15T08:00:00Z', status: 'picked_up' },
        { lat: 24.6877, lng: 46.7219, timestamp: '2024-01-15T09:30:00Z', status: 'in_transit' },
        { lat: 24.6500, lng: 46.7000, timestamp: '2024-01-15T10:15:00Z', status: 'in_transit' }
      ],
      estimatedDelivery: '2024-01-16T14:00:00Z',
      driver: {
        name: 'Ahmed Mohammed',
        phone: '+966501234567',
        vehicleNumber: 'ABC 1234'
      },
      customer: {
        name: 'Mohammed Abdullah',
        phone: '+966507654321'
      },
      shipmentDetails: {
        fromCity: 'Riyadh',
        toCity: 'Jeddah',
        weight: '2.5 kg',
        dimensions: '30x20x15 cm'
      },
      timeline: [
        {
          status: 'pending',
          timestamp: '2024-01-14T20:00:00Z',
          description: 'Order received'
        },
        {
          status: 'confirmed',
          timestamp: '2024-01-14T21:30:00Z',
          description: 'Order confirmed and driver assigned'
        },
        {
          status: 'picked_up',
          timestamp: '2024-01-15T08:00:00Z',
          description: 'Package picked up from sender'
        },
        {
          status: 'in_transit',
          timestamp: '2024-01-15T09:30:00Z',
          description: 'Package in transit'
        }
      ]
    };

    trackingData['BK-0987654321'] = {
      orderId: 'BK-0987654321',
      trackingNumber: 'TR-0987654321',
      status: 'delivered',
      currentLocation: {
        lat: 21.3891,
        lng: 39.8579,
        address: 'Jeddah, Kingdom of Saudi Arabia'
      },
      route: [
        { lat: 24.7136, lng: 46.6753, timestamp: '2024-01-10T08:00:00Z', status: 'picked_up' },
        { lat: 23.8859, lng: 45.0792, timestamp: '2024-01-10T14:00:00Z', status: 'in_transit' },
        { lat: 21.3891, lng: 39.8579, timestamp: '2024-01-11T10:00:00Z', status: 'delivered' }
      ],
      estimatedDelivery: '2024-01-11T12:00:00Z',
      actualDelivery: '2024-01-11T10:30:00Z',
      driver: {
        name: 'Salem Ahmed',
        phone: '+966502345678',
        vehicleNumber: 'DEF 5678'
      },
      customer: {
        name: 'Fatima Ali',
        phone: '+966508765432'
      },
      shipmentDetails: {
        fromCity: 'Riyadh',
        toCity: 'Jeddah',
        weight: '1.2 kg',
        dimensions: '25x15x10 cm'
      },
      timeline: [
        {
          status: 'pending',
          timestamp: '2024-01-09T18:00:00Z',
          description: 'Order received'
        },
        {
          status: 'confirmed',
          timestamp: '2024-01-09T19:15:00Z',
          description: 'Order confirmed and driver assigned'
        },
        {
          status: 'picked_up',
          timestamp: '2024-01-10T08:00:00Z',
          description: 'Package picked up from sender'
        },
        {
          status: 'in_transit',
          timestamp: '2024-01-10T14:00:00Z',
          description: 'Package in transit'
        },
        {
          status: 'delivered',
          timestamp: '2024-01-11T10:30:00Z',
          description: 'Package delivered successfully'
        }
      ]
    };
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeMockData();
    
    const { id: orderId } = params;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'معرف الطلب مطلوب'
      }, { status: 400 });
    }

    let tracking = trackingData[orderId];
    
    if (!tracking) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على الطلب'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    tracking = {
      ...tracking,
      id: tracking.orderId,
      status: tracking.status,
      currentLocation: tracking.currentLocation,
      path: tracking.route || [],
      fromCity: tracking.shipmentDetails?.fromCity || 'Riyadh',
      toCity: tracking.shipmentDetails?.toCity || 'Jeddah'
    };

    // Simulate real-time updates by slightly modifying current location for in-transit orders
    if (tracking.status === 'in_transit') {
      const now = new Date();
      const lastUpdate = new Date(tracking.route[tracking.route.length - 1].timestamp);
      const timeDiff = now.getTime() - lastUpdate.getTime();
      
      // If more than 30 minutes have passed, add a new location update
      if (timeDiff > 30 * 60 * 1000) {
        const newLat = tracking.currentLocation.lat + (Math.random() - 0.5) * 0.01;
        const newLng = tracking.currentLocation.lng + (Math.random() - 0.5) * 0.01;
        
        tracking.currentLocation.lat = newLat;
        tracking.currentLocation.lng = newLng;
        tracking.route.push({
          lat: newLat,
          lng: newLng,
          timestamp: now.toISOString(),
          status: 'in_transit'
        });
      }
    }

    return NextResponse.json(tracking);

  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching tracking data'
    }, { status: 500 });
  }
}

// Update tracking status (for admin/driver use)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeMockData();
    
    const { id: orderId } = params;
    const body = await request.json();
    const { status, location, notes } = body;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Order ID is required'
      }, { status: 400 });
    }

    const tracking = trackingData[orderId];
    
    if (!tracking) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }

    // Update status
    if (status) {
      tracking.status = status;
      tracking.timeline.push({
        status,
        timestamp: new Date().toISOString(),
        description: getStatusDescription(status),
        notes
      });

      if (status === 'delivered') {
        tracking.actualDelivery = new Date().toISOString();
      }
    }

    // Update location
    if (location) {
      tracking.currentLocation = location;
      tracking.route.push({
        ...location,
        timestamp: new Date().toISOString(),
        status: tracking.status
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment status updated successfully',
      data: tracking
    });

  } catch (error) {
    console.error('Update tracking error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while updating tracking data'
    }, { status: 500 });
  }
}

function getStatusDescription(status: string): string {
  const descriptions: { [key: string]: string } = {
    'pending': 'Order received',
    'confirmed': 'Order confirmed',
    'picked_up': 'Package picked up',
    'in_transit': 'Package in transit',
    'out_for_delivery': 'Out for delivery',
    'delivered': 'Delivered successfully',
    'failed_delivery': 'Delivery failed',
    'returned': 'Package returned'
  };
  
  return descriptions[status] || 'Status update';
}
