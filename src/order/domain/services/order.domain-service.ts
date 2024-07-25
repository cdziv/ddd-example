import { Injectable } from '@nestjs/common';
import { DecimalAmount, ExchangeRate, PriceV2 } from '../vo';

@Injectable()
export class OrderDomainService {
  exchange(originalAmount: DecimalAmount, exchangeRate: ExchangeRate): PriceV2 {
    const newAmount = originalAmount.mul(
      exchangeRate.value.rate.value.decimal.toNumber(),
    );
    return new PriceV2({
      amount: newAmount,
      currency: exchangeRate.value.to,
    });
  }
}
