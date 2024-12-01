import { UserResource } from '@/types/user';
import { TripResource } from '@/types/trip';
import { SeatResource } from '@/types/vehicle';

export type TicketResource = {
  id: number;
  user_id: number;
  user?: UserResource;
  trip_id: number;
  trip?: TripResource;
  seat_id: number;
  seat?: SeatResource;
  price: number;
  status: TicketStatusEnum;
};

export const TICKET_STATUS_ENUM = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  CANCELLED: 'cancelled',
  USED: 'used',
} as const;

export type TicketStatusEnum =
  (typeof TICKET_STATUS_ENUM)[keyof typeof TICKET_STATUS_ENUM];
