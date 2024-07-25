import { Id, RepositoryPort } from '../../../common';
import { OrderAR } from '../../domain';

export type OrderRepositoryPort = RepositoryPort<OrderAR, Id>;
