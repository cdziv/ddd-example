import { Id } from '@/common';

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER' as const;
export type EmailProviderPort = {
  sendBookingCreatedEmail: (bookingId: Id) => Promise<void>;
};
