import { getCookie } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ReservedSeat {
  reservedSeatId: number;
  rowNumber: number;
  seatNumber: number;
  ticketId: number;
  seatingPlanId: number;
}

export interface Ticket {
  ticketId: number;
  performanceId: number;
  userId: string;
  userEmail?: string;
  userName?: string;
  showName?: string;
  venueName?: string;
  qrImageUrl: string;
  qrInCode: string;
  startTime: TimeSpan;
  endTime: TimeSpan;
  performanceDate: string;
  isCheckedIn: boolean;
  cancelled: boolean;
  createdAt?: string;
  updatedAt?: string;
  reservedSeats?: ReservedSeat[];
  price?: number;
  ticketTypeName?: string;
}

export async function getGroupedTickets(): Promise<Ticket[]> {
  const token = getCookie('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/tickets/group-by-booking`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function getTicketsByBookingRef(bookingRef: string): Promise<Ticket[]> {
  const token = getCookie('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/tickets/by-booking/${bookingRef}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function bulkUpdateTicketsByBookingRef(
  bookingRef: string,
  values: { isCheckedIn: boolean; cancelled: boolean }
): Promise<Ticket[]> {
  const token = getCookie('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/tickets/booking/${bookingRef}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function bulkDeleteTicketsByBookingRef(bookingRef: string): Promise<void> {
  const token = getCookie('accessToken');
  const response = await fetch(`${API_BASE_URL}/api/tickets/booking/${bookingRef}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
}
