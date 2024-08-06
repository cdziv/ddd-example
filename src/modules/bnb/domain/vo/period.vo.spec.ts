import { faker } from '@faker-js/faker';
import { Period } from './period.vo';

describe('Period', () => {
  const validProps = {
    startsAt: faker.date.recent(),
    endsAt: faker.date.soon(),
  };

  describe('constructor', () => {
    it('When passing value is valid props, should return Period with same value', () => {
      const period = new Period(validProps);

      expect(period).toBeInstanceOf(Period);
      expect(period.value).toEqual(validProps);
    });
  });
});
