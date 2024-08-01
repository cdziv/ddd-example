import { ExchangeRate } from '../../domain';

export interface ExchangeRateProviderPort {
  getUsdToTwdRate(): Promise<ExchangeRate>;
}
