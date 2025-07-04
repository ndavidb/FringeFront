/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * Fringe API
 * API for Fringe application
 * OpenAPI spec version: v1
 */
import type { TimeSpan } from './timeSpan';

export interface CreateTicketDTO {
  ticketTypeId?: number;
  performanceId?: number;
  venueId?: number;
  userId?: string;
  /** @nullable */
  qrImageUrl?: string | null;
  /** @nullable */
  qrInCode?: string | null;
  startTime?: TimeSpan;
  endTime?: TimeSpan;
  isCheckedIn?: boolean;
  cancel?: boolean;
}
