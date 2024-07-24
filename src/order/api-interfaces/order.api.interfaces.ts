import { DecimalString } from '../../common';

export type IOrderCreateBody = {
  id: string;
  name: string;
  address: {
    city: string;
    district: string;
    street: string;
  };
  price: DecimalString;
  currency: string;
};
export type IOrderResponse = IOrderCreateBody;
