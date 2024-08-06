import { RepositoryPort } from '@/common';
import { BookingAR } from '../../domain';

export const BOOKING_REPOSITORY = 'BOOKING_REPOSITORY' as const;
export type BookingRepositoryPort = RepositoryPort<BookingAR>;
