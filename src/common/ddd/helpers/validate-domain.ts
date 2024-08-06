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
      .map((iss) => {
        const pathStr = iss.path.length > 0 ? `[${iss.path.join(',')}]` : '';
        return pathStr ? `${pathStr}:${iss.message}` : iss.message;
      })
      .join('; ');
    return new DddArgumentInvalidDomainError(message);
  }
}
