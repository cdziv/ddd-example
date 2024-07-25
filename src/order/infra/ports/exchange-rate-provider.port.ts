export interface ExchangeRateProviderPort {
  usdToTwd(): Promise<number>;
}
