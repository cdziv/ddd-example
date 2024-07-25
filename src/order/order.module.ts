import { Module, Provider } from '@nestjs/common';
import { EXCHANGE_RATE_PROVIDER, ORDER_REPOSITORY } from './order.constants';
import { MockExchangeRateProvider } from './infra/mock-exchange-rate-provider';
import { OrderDomainService } from './domain';
import { OrderController } from './controller';
import { OrderDtoAssembler, OrderService } from './application';

const controllers = [OrderController];
const dtoAssemblers = [OrderDtoAssembler];
const services = [OrderService];
const domainServices = [OrderDomainService];
const providers: Provider[] = [
  {
    provide: EXCHANGE_RATE_PROVIDER,
    useClass: MockExchangeRateProvider,
  },
  {
    provide: ORDER_REPOSITORY,
    // To be implemented
    useValue: {},
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
