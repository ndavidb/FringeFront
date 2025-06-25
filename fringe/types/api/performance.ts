import { TimeSpan } from './timeSpan';
import { SeatingType } from './seatingType';
import {TicketPrice} from "@/types/api/TicketPrice";

export interface Performance {
    performanceId: number;
    showId: number;
    showName: string;
    venueId: number;
    venueName: string;
    performanceDate: string;
    startTime: TimeSpan;
    endTime: TimeSpan;
    seatingType: SeatingType;
    soldOut: boolean;
    cancel: boolean;
    active: boolean;
    createdAt: string;
    updatedAt?: string;
    ticketPrices?: TicketPrice[];
}