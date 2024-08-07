import { z } from 'zod';
import { validateDomain, ValueObject } from '@/common';

const addressSchema = z.object({
  city: z.string().min(1).max(30),
  district: z.string().min(1).max(30),
  street: z.string().min(1).max(120),
});
type AddressProps = {
  city: string;
  district: string;
  street: string;
};

/**
 * 地址需要包含城市、區域、街道。
 */
export class Address extends ValueObject<AddressProps> {
  get city() {
    return this.value.city;
  }
  get district() {
    return this.value.district;
  }
  get street() {
    return this.value.street;
  }
  get fullAddress() {
    return `${this.city} ${this.district} ${this.street}`;
  }

  validate() {
    return validateDomain(addressSchema, this.value);
  }
}
