import { RepositoryPort } from '@/common';
import { RoomAR } from '../../domain';

export const ROOM_REPOSITORY = 'ROOM_REPOSITORY' as const;
export type RoomRepositoryPort = RepositoryPort<RoomAR>;
