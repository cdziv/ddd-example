import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderCreateBody, OrderResponse } from '../../api-interfaces';
import { OrderCreateParams, orderCreateBodySchema } from '../dto';
import { Id, isAlphabeticWords, isCapitalized } from '../../../common';
import {
  Address,
  City,
  Currency,
  District,
  OrderAR,
  OrderName,
  Price,
  Street,
} from '../../domain';
import { CurrencyType } from '../../order.constants';
import { validate as isUUID } from 'uuid';

/**
 * Dto Assembler 作為服務與 API 之間的資料轉換層。
 */
@Injectable()
export class OrderDtoAssembler {
  /**
   * 有必要的話，可以直接在這邊轉換成 Domain Object。
   * 按指定需求這邊只驗證資料型別。
   */
  orderCreateBodyToParams(body: OrderCreateBody): OrderCreateParams {
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

  orderARToResponse(order: OrderAR): OrderResponse {
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

  /**
   * DTO Assembler 中專注在確認 OrderCreateParams 的格式是否正確，並轉換成 OrderAR
   * 訂單金額與幣別的轉換在另外的方法處理
   */
  orderCreateParamsToOrderAR(params: OrderCreateParams): OrderAR {
    try {
      if (!isAlphabeticWords(params.name)) {
        throw new BadRequestException('Name contains non-English characters');
      }
      if (!isCapitalized(params.name)) {
        throw new BadRequestException('Name is not capitalized');
      }
      const name = new OrderName({ value: params.name });
      const price = Price.create(params.price);
      let currency: Currency;
      try {
        currency = new Currency({ value: params.currency as CurrencyType });
      } catch (err) {
        throw new BadRequestException('Currency format is wrong');
      }
      const city = new City({ value: params.address.city });
      const district = new District({ value: params.address.district });
      const street = new Street({ value: params.address.street });
      const address = new Address({ city, district, street });

      // 為了滿足指定實作規格，這邊用傳入的 id new 一個 OrderAR
      // 否則應該使用 OrderAR.create 創建一個全新物件
      // example: return OrderAR.create({ name, address, price, currency });
      if (!isUUID(params.id)) {
        throw new BadRequestException('Invalid id format');
      }
      const id = new Id({ value: params.id });
      return new OrderAR({ id, name, address, price, currency });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      // 處理其他未被定義的格式錯誤
      throw new BadRequestException();
    }
  }
}
