import { BadRequestException } from '@nestjs/common';
import { IOrderCreateBody } from '../../api-interfaces';
import { OrderCreateBody, orderCreateBodySchema } from '../dto';

/**
 * Dto Assembler 作為服務與 API 之間的資料轉換層。
 */
export class OrderDtoAssembler {
  static orderCreateBodyToObject(body: IOrderCreateBody): OrderCreateBody {
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
}
