import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderResponse } from '../../api-interfaces';
import { OrderCreateParams } from '../dto';
import { DecimalAmount, OrderDomainService } from '../../domain';
import { DOMAIN_EVENT_EMITTER, ORDER_REPOSITORY } from '../../order.constants';
import { OrderDtoAssembler } from '../dto-assemblers';
import { DomainEventEmitter } from '../../../common';
import { OrderRepositoryPort } from '../../infra';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DOMAIN_EVENT_EMITTER)
    private readonly domainEventEmitter: DomainEventEmitter,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly orderDomainService: OrderDomainService,
    private readonly orderDtoAssembler: OrderDtoAssembler,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async createOrder(params: OrderCreateParams): Promise<OrderResponse> {
    const order = this.orderDtoAssembler.orderCreateParamsToOrderAR(params);

    const currencyTransformedOrder =
      await this.exchangeRateService.switchToTWDCurrencyOrder(order);
    // 驗證 order 是否符合 create order 的規則
    if (
      currencyTransformedOrder.props.price.value.amount.gt(
        DecimalAmount.create(2000),
      )
    ) {
      throw new BadRequestException('Price is over 2000');
    }

    // 這邊可以將 order 持久化到資料庫
    await this.orderRepository.save(currencyTransformedOrder);
    // publish domain events 可以實作在 repository.save 的邏輯裡面，可以較接近 Unit of Work
    currencyTransformedOrder.publishDomainEvents(this.domainEventEmitter);

    return this.orderDtoAssembler.orderARToResponse(currencyTransformedOrder);
  }
}
