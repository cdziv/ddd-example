import { CurrencyType } from '../../bnb.constants';
import { DecimalAmount, Price } from '../../domain';

export const EXCHANGE_PROVIDER = 'EXCHANGE_PROVIDER' as const;
export type ExchangeProviderPort = {
  getExchangePrice: (spec: ExchangeSpecification) => Promise<Price>;
};

export type ExchangeSpecification = {
  currencyFrom: CurrencyType;
  currencyTo: CurrencyType;
  amount: DecimalAmount;
  date: Date;
};
