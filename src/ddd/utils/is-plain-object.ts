import { PlainObject } from '../interfaces';

export function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' && // 檢查 value 是否為 object
    value !== null && // 檢查 value 不是 null
    !Array.isArray(value) && // 檢查 value 不是 array
    Object.getPrototypeOf(value) === Object.prototype // 檢查 value 的原型是否是 Object.prototype
  );
}
