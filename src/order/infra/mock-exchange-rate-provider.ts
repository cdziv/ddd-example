import { ExchangeRateProviderPort } from '../domain';

export class MockExchangeRateProvider implements ExchangeRateProviderPort {
  /**
   * @note just for demo, hard code the exchange rate
   */
  async usdToTwd(): Promise<number> {
    return 31;
  }
}
