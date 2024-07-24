import { DddArgumentInvalidDomainError } from '../errors';
import { PlainObject, ValueObjectProps } from '../interfaces';
import { ValueObject } from './value-object.base';

/**
 * Entity 是一個具有識別值的物件，它代表了一個具有生命週期的物件。
 * Entity 的識別值是一個 Value Object。
 *
 * @note
 * DDD 並未強制 Entity 在程式碼中應該要是不可變的物件，因為它在概念上是具有生命週期的。
 * 但為了更清晰與可追蹤的撰寫邏輯，我將 Entity 實作為不可變的物件。
 * 此版本是一個簡單的實踐，應該視需求進行擴充。例如將 _props 的值儲存為 immutable 的物件以避免外部操作異動等等。
 */
export abstract class Entity<
  T extends PlainObject,
  Id extends ValueObject<ValueObjectProps> = ValueObject<ValueObjectProps>,
> {
  private _props: T;
  private _cachedValue: T | undefined;

  constructor(props: T) {
    this._props = props;
    this.guard();
  }

  /**
   * Entity 的識別值，為一個 Value Object
   */
  abstract get id(): Id;

  /**
   * 根據 Entity 的 props 進行修改，並且返回一個新的 Entity。
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

  /**
   * 若 id 相同，則代表兩個 Entity 是相同的。
   */
  equals(other: Entity<any, any>) {
    return (
      other instanceof this.constructor &&
      this.id.equals(other.id as ValueObject<any>)
    );
  }
  /**
   * 若 id 不相同，則代表兩個 Entity 是不相同的。
   */
  notEquals(other: Entity<any, any>) {
    return !this.equals(other);
  }

  /**
   * 取得 Entity 的 props。
   *
   * @note 由於 _props 可能可以被儲存為 immutable 物件而造成讀取時的額外運算，所以透過 _cachedValue 來做暫存。
   * （此版本沒有實踐 immutable 物件）
   */
  public get props(): T {
    if (!this._cachedValue) {
      this._cachedValue = this._props;
    }
    return this._cachedValue;
  }

  abstract validate(): Error | void;

  guard() {
    const emptyGuardError = this._emptyGuard();
    if (emptyGuardError) {
      throw new DddArgumentInvalidDomainError(
        `the entity ${this.constructor.name} is invalid: ${emptyGuardError.message}`,
      );
    }

    const error = this.validate();
    if (error) {
      throw new DddArgumentInvalidDomainError(
        `the entity ${this.constructor.name} is invalid: ${error.message}`,
      );
    }
  }
  private _emptyGuard(): Error | void {
    if (
      typeof this._props === 'object' &&
      Object.keys(this._props).length === 0
    ) {
      return new Error('entity is not object or empty');
    }
  }
}
