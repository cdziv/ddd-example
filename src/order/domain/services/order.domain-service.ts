import { Inject, Injectable } from '@nestjs/common';
import { CurrencyType, EXCHANGE_RATE_PROVIDER } from '../../order.constants';
import { ExchangeRateProviderPort } from '../ports/exchange-rate-provider.port';
import { Currency, Price } from '../vo';
import { ParamInvalidDomainError } from '../../../common';
import { OrderAR } from '../entities';

@Injectable()
export class OrderDomainService {
  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly exchangeRateProvider: ExchangeRateProviderPort,
  ) {}

  async switchToTWDCurrencyOrder(order: OrderAR): Promise<OrderAR> {
    if (order.props.currency.value === CurrencyType.USD) {
      const priceTWD = await this.switchUSDToTWD(
        order.props.currency,
        order.props.price,
      );
      const newCurrency = new Currency({ value: CurrencyType.TWD });
      return order.update({
        currency: newCurrency,
        price: priceTWD,
      });
    }
    return order;
  }

  async switchUSDToTWD(currency: Currency, price: Price): Promise<Price> {
    if (currency.value === CurrencyType.USD) {
      const rate = await this.exchangeRateProvider.usdToTwd();
      return price.mul(rate);
    }
    throw new ParamInvalidDomainError('Invalid currency');
  }
}
