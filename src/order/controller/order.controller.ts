import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderDtoAssembler, OrderService } from '../application';
import { OrderCreateBody, OrderResponse } from '../api-interfaces';

@Controller('api/orders')
export class OrderController {
  constructor(
    private readonly orderDtoAssembler: OrderDtoAssembler,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(201)
  async createOrder(@Body() body: OrderCreateBody): Promise<OrderResponse> {
    // 透過 Dto Assembler 將 API 的資料轉換成應用層的物件，驗證資料型別的過程放在 DtoAssembler 裡面。
    const params = this.orderDtoAssembler.orderCreateBodyToParams(body);
    return this.orderService.createOrder(params);
  }
}
