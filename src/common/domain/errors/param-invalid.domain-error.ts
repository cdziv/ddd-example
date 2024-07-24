import { DomainError } from '../../ddd';

export class ParamInvalidDomainError extends DomainError {
  constructor(message = 'Parameter is invalid') {
    super(message);
  }
}
