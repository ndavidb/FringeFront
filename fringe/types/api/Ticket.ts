export interface Ticket {
    ticketId: number;
    ticketTypeId: number;
    performanceId: number;
    venueId: number;
    userId: string;
    qrImageUrl: string;
    qrInCode: string;
    startTime: string;
    endTime: string;
    isCheckedIn: boolean;
  }
  