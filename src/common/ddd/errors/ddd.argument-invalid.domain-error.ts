import { DomainError } from './domain-error.base';

export class DddArgumentInvalidDomainError extends DomainError {
  constructor(message: string = 'Ddd argument is invalid') {
    super(message);
  }
}
