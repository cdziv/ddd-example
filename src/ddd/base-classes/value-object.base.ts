import isEqual from 'lodash.isequal';
import { DddArgumentInvalidDomainError } from '../errors';
import { ValueObjectProps, ValueObjectValue } from '../interfaces';
import { isDomainPrimitive, isPlainObject } from '../utils';

/**
 * Value Object 是一個不可變的物件，它代表了一個值，這個值可能是一個 Domain Primitive 或是一個 Object Shape，
 * 不應該直接修改 Value Object 的值，而是應該透過創建新的 Value Object 來代表新的值。
 * 當 Value Object 的值是一個 Domain Primitive 時，應該使用 DomainPrimitiveProps 來創建 Value Object 實體。
 *
 * @note 此版本是一個簡單的實踐，應該視需求進行擴充。例如將 _props 的值儲存為 immutable 的物件以避免外部操作異動等等。
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  private _props: T;
  private _cachedValue: ValueObjectValue<T> | undefined;

  constructor(props: T) {
    // 確認 props 是一個 plain object
    if (!isPlainObject(props)) {
      throw new DddArgumentInvalidDomainError('Prop should be plain object');
    }
    // 更好的做法可能是將 props 儲存為 immutable 物件
    this._props = props;

    // 進行驗證
    const error = this.validate();
    if (error) {
      throw new DddArgumentInvalidDomainError(
        `the value object ${this.constructor.name} is invalid: ${error.message}`,
      );
    }
  }

  /**
   * 驗證 Value Object 是否合法。
   * 不直接拋出錯誤，而是回傳錯誤物件，讓外部程式碼決定如何處理。
   */
  abstract validate(): Error | void;

  /**
   * 根據 Value Object 當前的值進行修改，並且返回一個新的 Value Object。
   * 此方法為 protected，應該在定義的子類別方法中使用。
   *
   * @note 這個方法是一個簡單的實踐，應該視需求進行擴充。
   */
  protected patchValues(props: Partial<T>): this;
  protected patchValues(updater: (props: this) => Partial<T>): this;
  protected patchValues(
    updater: Partial<T> | ((props: this) => Partial<T>),
  ): this {
    if (updater instanceof Function) {
      const newProps = {
        ...this._props,
        ...updater(this),
      };
      return new (this.constructor as any)(newProps);
    } else {
      const newProps = {
        ...this._props,
        ...updater,
      };
      return new (this.constructor as any)(newProps);
    }
  }

  equals(other: ValueObject<T>): boolean {
    return (
      other instanceof this.constructor && isEqual(this.value, other.value)
    );
  }
  notEquals(other: ValueObject<T>): boolean {
    return !this.equals(other);
  }

  public get isDomainPrimitive(): boolean {
    if (Object.keys(this._props).length !== 1) return false;
    // 因為 _props 可能為空物件，所以需要確認是否有 value prop 是否存在
    if (!this._props.hasOwnProperty('value')) return false;
    const value = this._props['value'];
    return isDomainPrimitive(value);
  }

  /**
   * 取得 Value Object 的值。
   * 如果 Value Object 的值是一個 Domain Primitive，則會回傳 Domain Primitive 的值而非整個 Object，
   * 這樣做是為了讓 Value Object 的值更容易被使用。
   *
   * @note 由於 _props 可能可以被儲存為 immutable 物件而造成讀取時的額外運算，所以透過 _cachedValue 來做暫存。
   * （此版本沒有實踐 immutable 物件）
   */
  public get value(): ValueObjectValue<T> {
    if (!this._cachedValue) {
      this._cachedValue = this.isDomainPrimitive
        ? (this._props['value'] as ValueObjectValue<T>)
        : (this._props as ValueObjectValue<T>);
    }
    return this._cachedValue;
  }
}
