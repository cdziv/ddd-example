import { CurrencyType } from '../../bnb.constants';
import { DecimalAmount, PriceV3 } from '../../domain';

export const EXCHANGE_PROVIDER = 'EXCHANGE_PROVIDER' as const;
export type ExchangeProviderPort = {
  getExchangePrice: (spec: ExchangeSpecification) => Promise<PriceV3>;
};

export type ExchangeSpecification = {
  currencyFrom: CurrencyType;
  currencyTo: CurrencyType;
  amount: DecimalAmount;
  date: Date;
};
