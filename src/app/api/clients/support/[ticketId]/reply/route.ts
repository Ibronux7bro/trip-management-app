import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Import the support tickets from the main support route
// In a real application, this would be from a database
let supportTickets: any[] = [];

// Validation schema for reply
const replySchema = z.object({
  message: z.string().min(1, 'Message is required'),
  clientId: z.string().min(1, 'Client ID is required'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    const body = await request.json();
    
    // Validate the reply data
    const validationResult = replySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid reply data',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { message, clientId } = validationResult.data;
    
    // Find the ticket
    const ticketIndex = supportTickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Ticket not found'
      }, { status: 404 });
    }

    const ticket = supportTickets[ticketIndex];
    
    // Check if the client owns this ticket
    if (ticket.clientId !== clientId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access to this ticket'
      }, { status: 403 });
    }

    // Create new reply
    const newReply = {
      id: `RPL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      isFromSupport: false,
      createdAt: new Date().toISOString(),
      author: 'Customer'
    };

    // Add reply to ticket
    if (!ticket.replies) {
      ticket.replies = [];
    }
    ticket.replies.push(newReply);
    
    // Update ticket status and timestamp
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      ticket.status = 'open'; // Reopen if customer replies to resolved/closed ticket
    }
    ticket.updatedAt = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      message: 'Reply added successfully',
      data: {
        ticket,
        newReply
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Reply creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while adding the reply'
    }, { status: 500 });
  }
}

// Get all replies for a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json({
        success: false,
        message: 'Client ID is required'
      }, { status: 400 });
    }
    
    // Find the ticket
    const ticket = supportTickets.find(ticket => ticket.id === ticketId);
    
    if (!ticket) {
      return NextResponse.json({
        success: false,
        message: 'Ticket not found'
      }, { status: 404 });
    }

    // Check if the client owns this ticket
    if (ticket.clientId !== clientId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access to this ticket'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        replies: ticket.replies || []
      }
    });

  } catch (error) {
    console.error('Get replies error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching replies'
    }, { status: 500 });
  }
}