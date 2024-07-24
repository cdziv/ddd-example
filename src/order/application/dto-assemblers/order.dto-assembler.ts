import { BadRequestException } from '@nestjs/common';
import { OrderCreateBody, OrderResponse } from '../../api-interfaces';
import { OrderCreateParams, orderCreateBodySchema } from '../dto';
import { OrderAR } from '../..//domain';

/**
 * Dto Assembler 作為服務與 API 之間的資料轉換層。
 */
export class OrderDtoAssembler {
  /**
   * 有必要的話，可以直接在這邊轉換成 Domain Object。
   * 按指定需求這邊只驗證資料型別。
   */
  static orderCreateBodyToParams(body: OrderCreateBody): OrderCreateParams {
    try {
      const parsed = orderCreateBodySchema.parse(body);
      return {
        id: parsed.id,
        name: parsed.name,
        address: {
          city: parsed.address.city,
          district: parsed.address.district,
          street: parsed.address.street,
        },
        price: parsed.price,
        currency: parsed.currency,
      };
    } catch (err) {
      throw new BadRequestException();
    }
  }

  static orderARToResponse(order: OrderAR): OrderResponse {
    return {
      id: order.id.value,
      name: order.props.name.value,
      address: {
        city: order.props.address.value.city.value,
        district: order.props.address.value.district.value,
        street: order.props.address.value.street.value,
      },
      price: order.props.price.value.decimal.toString(),
      currency: order.props.currency.value,
    };
  }
}
