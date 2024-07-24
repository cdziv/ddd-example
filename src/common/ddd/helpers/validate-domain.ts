import { ZodType } from 'zod';
import { DddArgumentInvalidDomainError } from '../errors';

export function validateDomain(
  schema: ZodType,
  props: any,
): DddArgumentInvalidDomainError | undefined {
  const result = schema.safeParse(props);
  if (result.success) {
    return;
  } else {
    const message = result.error.issues
      .map((iss) => `${iss.path}:${iss.message}`)
      .join('; ');
    return new DddArgumentInvalidDomainError(message);
  }
}
