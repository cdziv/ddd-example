import { Inject, Injectable } from '@nestjs/common';
import { CurrencyType, EXCHANGE_RATE_PROVIDER } from '../../order.constants';
import { ExchangeRateProviderPort } from '../../infra';
import { OrderAR, OrderDomainService } from '../../domain';

@Injectable()
export class ExchangeRateService {
  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly exchangeRateProvider: ExchangeRateProviderPort,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async switchToTWDCurrencyOrder(order: OrderAR): Promise<OrderAR> {
    if (order.props.price.value.currency.value === CurrencyType.USD) {
      const exchangeRate = await this.exchangeRateProvider.getUsdToTwdRate();
      const originalAmount = order.props.price.value.amount;
      const priceTWD = this.orderDomainService.exchange(
        originalAmount,
        exchangeRate,
      );
      return order.update({
        price: priceTWD,
      });
    }
    return order;
  }
}
