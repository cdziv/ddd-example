import { Body, Controller, Post } from '@nestjs/common';
import { OrderDtoAssembler, OrderService } from '../application';
import { IOrderCreateBody, IOrderResponse } from '../api-interfaces';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: IOrderCreateBody): Promise<IOrderResponse> {
    // 透過 Dto Assembler 將 API 的資料轉換成應用層的物件，驗證資料型別的過程放在 DtoAssembler 裡面。
    const params = OrderDtoAssembler.orderCreateBodyToObject(body);
    return this.orderService.createOrder(params);
  }
}
