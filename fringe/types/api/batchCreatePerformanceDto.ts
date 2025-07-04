/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * Fringe API
 * API for Fringe application
 * OpenAPI spec version: v1
 */
import type { TimeSpan } from './timeSpan';
import type { SeatingType } from './seatingType';

export interface BatchCreatePerformanceDto {
  showId: number;
  /** @minItems 1 */
  performanceDates: string[];
  startTime: TimeSpan;
  endTime: TimeSpan;
  seatingType?: SeatingType;
  active?: boolean;
}
