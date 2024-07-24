import { Injectable } from '@nestjs/common';
import { IOrderResponse } from '../../api-interfaces';
import { OrderCreateBody } from '../dto';

@Injectable()
export class OrderService {
  constructor() {}

  async createOrder(params: OrderCreateBody): Promise<IOrderResponse> {
    return '' as any;
  }
}
