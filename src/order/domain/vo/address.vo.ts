import { z } from 'zod';
import { validateDomain, ValueObject, voSchema } from '../../../common';
import { District } from './district.vo';
import { City } from './city.vo';
import { Street } from './street.vo';

const addressSchema = z.object({
  city: voSchema(City),
  district: voSchema(District),
  street: voSchema(Street),
});
type AddressProps = {
  city: City;
  district: District;
  street: Street;
};

export class Address extends ValueObject<AddressProps> {
  validate() {
    return validateDomain(addressSchema, this.value);
  }
}
