export type Primitive = string | number | boolean | undefined | null;
export type PlainObject = Record<string, unknown>;
/**
 * 因為 Date 常常在應用中被當作單一值來使用，所以我們將 Date 加入到 DomainPrimitive 中
 */
export type DomainPrimitive = Primitive | Date;
/**
 * 如果 Value Object 的值是一個 Domain Primitive，則應該要使用 DomainPrimitiveProps 來創建 Value Object 實體
 */
export type DomainPrimitiveProps<T> = { value: T };
export type ValueObjectProps = PlainObject | DomainPrimitiveProps<unknown>;
export type ValueObjectValue<T> =
  T extends DomainPrimitiveProps<infer R> ? R : T;
