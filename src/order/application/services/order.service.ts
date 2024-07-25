import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderResponse } from '../../api-interfaces';
import { OrderCreateParams } from '../dto';
import { OrderDomainService, OrderRepositoryPort, Price } from '../../domain';
import { ORDER_REPOSITORY } from '../../order.constants';
import { OrderDtoAssembler } from '../dto-assemblers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async createOrder(params: OrderCreateParams): Promise<OrderResponse> {
    const order = OrderDtoAssembler.orderCreateParamsToOrderAR(params);

    // 驗證 order 是否符合 create order 的規則
    if (order.props.price.gt(Price.create(2000))) {
      throw new BadRequestException('Price is over 2000');
    }
    const currencyTransformedOrder =
      await this.orderDomainService.switchToTWDCurrencyOrder(order);

    // 這邊可以將 order 持久化到資料庫
    // publish domain events 可以實作在 repository.save 的邏輯裡面，可以達到較一致的 Unit of Work
    await this.orderRepository.save(currencyTransformedOrder);

    return OrderDtoAssembler.orderARToResponse(currencyTransformedOrder);
  }
}
