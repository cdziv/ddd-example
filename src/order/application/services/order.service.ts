import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderResponse } from '../../api-interfaces';
import { OrderCreateParams } from '../dto';
import { Id, isAlphabeticWords, isCapitalized } from '../../../common';
import {
  Address,
  City,
  Currency,
  District,
  OrderAR,
  OrderDomainService,
  OrderName,
  OrderRepositoryPort,
  Price,
  Street,
} from '../../domain';
import { CurrencyType, ORDER_REPOSITORY } from '../../order.constants';
import { validate as isUUID } from 'uuid';
import { OrderDtoAssembler } from '../dto-assemblers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async createOrder(params: OrderCreateParams): Promise<OrderResponse> {
    const order = this.orderCreateParamsToOrderAR(params);

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

  /**
   * 此方法專注在確認 OrderCreateParams 的格式是否正確，並轉換成 OrderAR
   * 訂單金額與幣別的轉換在另外的方法處理
   *
   * @note 這個方法其實也適合實作成一個 Dto Assembler
   */
  private orderCreateParamsToOrderAR(params: OrderCreateParams): OrderAR {
    try {
      if (!isAlphabeticWords(params.name)) {
        throw new BadRequestException('Name contains non-English characters');
      }
      if (!isCapitalized(params.name)) {
        throw new BadRequestException('Name is not capitalized');
      }
      const name = new OrderName({ value: params.name });
      const price = Price.create(params.price);
      const currency = new Currency({ value: params.currency as CurrencyType });
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
      // 處理其他未被定義的格式錯誤
      throw new BadRequestException();
    }
  }
  private transform;
}
