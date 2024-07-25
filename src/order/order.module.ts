import { Module, Provider } from '@nestjs/common';
import {
  DOMAIN_EVENT_EMITTER,
  EXCHANGE_RATE_PROVIDER,
  ORDER_REPOSITORY,
} from './order.constants';
import { MockExchangeRateProvider } from './infra/mock-exchange-rate-provider';
import { OrderDomainService } from './domain';
import { OrderController } from './controller';
import { OrderDtoAssembler, OrderService } from './application';
import { MockDomainEventEmitter, MockOrderRepository } from './infra';

const controllers = [OrderController];
const dtoAssemblers = [OrderDtoAssembler];
const services = [OrderService];
const domainServices = [OrderDomainService];
const providers: Provider[] = [
  /** Using mock providers for demo */
  {
    provide: DOMAIN_EVENT_EMITTER,
    useValue: MockDomainEventEmitter,
  },
  {
    provide: EXCHANGE_RATE_PROVIDER,
    useClass: MockExchangeRateProvider,
  },
  {
    provide: ORDER_REPOSITORY,
    useValue: MockOrderRepository,
  },

  ...services,
  ...dtoAssemblers,
  ...domainServices,
];

@Module({
  controllers,
  providers,
})
export class OrderModule {}
