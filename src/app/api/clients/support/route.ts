import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  clientId: string;
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'booking' | 'tracking' | 'payment' | 'technical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  replies?: SupportReply[];
};

type SupportReply = {
  id: string;
  message: string;
  isFromSupport: boolean;
  createdAt: string;
  author: string;
};

// Validation schema for support ticket
const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Ticket subject must be at least 5 characters'),
  message: z.string().min(10, 'Ticket message must be at least 10 characters'),
  clientId: z.string().min(1, 'Client ID is required'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  category: z.enum(['general', 'booking', 'tracking', 'payment', 'technical']).optional().default('general'),
});

// Mock database - In a real application, use a real database
let supportTickets: SupportTicket[] = [];

// Initialize some mock data
const initializeMockData = () => {
  if (supportTickets.length === 0) {
    supportTickets.push(
      {
        id: 'TKT-1234567890',
        subject: 'Inquiry about shipment status',
        message: 'I want to know the status of my shipment number TR-1234567890',
        clientId: 'CLIENT-001',
        priority: 'medium',
        category: 'tracking',
        status: 'resolved',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T15:30:00Z',
        replies: [
          {
            id: 'RPL-001',
            message: 'Thank you for contacting us. Your shipment is currently on the way and will arrive tomorrow.',
            isFromSupport: true,
            createdAt: '2024-01-10T11:30:00Z',
            author: 'Support Team'
          },
          {
            id: 'RPL-002',
            message: 'Thank you, the shipment was received successfully.',
            isFromSupport: false,
            createdAt: '2024-01-10T15:30:00Z',
            author: 'Customer'
          }
        ]
      },
      {
        id: 'TKT-0987654321',
        subject: 'Payment issue',
        message: 'The amount was not deducted from my account but the order shows as paid',
        clientId: 'CLIENT-002',
        priority: 'high',
        category: 'payment',
        status: 'in_progress',
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T16:00:00Z',
        replies: [
          {
            id: 'RPL-003',
            message: 'We apologize for this issue. Your account will be reviewed and we will respond within 24 hours.',
            isFromSupport: true,
            createdAt: '2024-01-12T16:00:00Z',
            author: 'Financial Support Team'
          }
        ]
      }
    );
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the support ticket data
    const validationResult = supportTicketSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid ticket data',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const ticketData = validationResult.data;
    
    // Generate ticket ID and create ticket record
    const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    };

    // Save to mock database
    supportTickets.push(newTicket);
    
    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      data: newTicket
    }, { status: 201 });

  } catch (error) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing the support request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    initializeMockData();
    
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    
    if (!clientId) {
      return NextResponse.json({
        success: false,
        message: 'Client ID is required'
      }, { status: 400 });
    }

    // Filter tickets by client ID and optional filters
    let filteredTickets = supportTickets.filter(ticket => ticket.clientId === clientId);
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }
    
    // Sort by creation date (newest first)
    filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      data: filteredTickets,
      total: filteredTickets.length,
      summary: {
        open: filteredTickets.filter(t => t.status === 'open').length,
        in_progress: filteredTickets.filter(t => t.status === 'in_progress').length,
        resolved: filteredTickets.filter(t => t.status === 'resolved').length,
        closed: filteredTickets.filter(t => t.status === 'closed').length,
      }
    });

  } catch (error) {
    console.error('Get support tickets error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching support tickets'
    }, { status: 500 });
  }
}
