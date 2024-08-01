import { Currency, DecimalAmount, ExchangeRate } from '../domain';
import { CurrencyType } from '../order.constants';
import { ExchangeRateProviderPort } from './ports';

export class MockExchangeRateProvider implements ExchangeRateProviderPort {
  /**
   * @note just for demo, hard code the exchange rate
   */
  async getUsdToTwdRate(): Promise<ExchangeRate> {
    const rate = DecimalAmount.create(31);
    return new ExchangeRate({
      from: new Currency({ value: CurrencyType.USD }),
      to: new Currency({ value: CurrencyType.TWD }),
      rate,
    });
  }
}
