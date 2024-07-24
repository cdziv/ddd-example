import { Module, Provider } from '@nestjs/common';
import { EXCHANGE_RATE_PROVIDER } from './order.constants';
import { MockExchangeRateProvider } from './infra/mock-exchange-rate-provider';
import { OrderDomainService } from './domain';

const domainServices = [OrderDomainService];
const providers: Provider[] = [
  {
    provide: EXCHANGE_RATE_PROVIDER,
    useClass: MockExchangeRateProvider,
  },
  ...domainServices,
];

@Module({
  controllers: [],
  providers,
  exports: [],
})
export class OrderModule {}
