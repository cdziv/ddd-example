export enum CurrencyType {
  TWD = 'TWD',
  USD = 'USD',
}

/* Tokens for dependency injection */
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY' as const;
export const EXCHANGE_RATE_PROVIDER = 'EXCHANGE_RATE_PROVIDER' as const;
