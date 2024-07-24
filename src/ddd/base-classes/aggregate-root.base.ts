import { DomainEvent } from './domain-event.base';
import { ValueObject } from './value-object.base';
import { Entity } from './entity.base';
import {
  DomainEventEmitter,
  PlainObject,
  ValueObjectProps,
} from '../interfaces';

/**
 * AggregateRoot 是一個繼承自 Entity，它可以包含數個 ValueObject 或 Entity，並維護內部物件的邏輯一致性。
 * 它可以發布 DomainEvent 到外部，通知外部系統進行相應的處理。
 *
 * @note
 * DDD 並未強制 AggregateRoot 在程式碼中應該要是不可變的物件，因為它在概念上是具有生命週期的。
 * 但為了更清晰與可追蹤的撰寫邏輯，我將 AggregateRoot 實作為不可變的物件。
 * 此版本是一個簡單的實踐，應該視需求進行擴充。例如將 _props 的值儲存為 immutable 的物件以避免外部操作異動等等。
 */
export abstract class AggregateRoot<
  T extends PlainObject,
  Id extends ValueObject<ValueObjectProps> = ValueObject<ValueObjectProps>,
> extends Entity<T, Id> {
  private _domainEvents: DomainEvent[] = [];

  constructor(props: T, domainEvents?: DomainEvent[]) {
    super(props);
    if (domainEvents) {
      this._domainEvents = domainEvents;
    }
  }

  protected override patchValues(props: Partial<T>): this;
  protected override patchValues(updater: (props: this) => Partial<T>): this;
  protected override patchValues(updater: any): this {
    const newProps = super.patchValues(updater);
    return new (this.constructor as any)(newProps, this._domainEvents);
  }

  public clearDomainEvents(): this {
    return new (this.constructor as any)(this.props, []);
  }
  public publishDomainEvents(eventEmitter: DomainEventEmitter): this {
    this._domainEvents.forEach((event) => {
      eventEmitter.emit(event.constructor.name, event);
    });
    return this.clearDomainEvents();
  }
  protected addDomainEvent(domainEvent: DomainEvent): this {
    const newDomainEvents = this._domainEvents.concat(domainEvent);
    return new (this.constructor as any)(this.props, newDomainEvents);
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }
}
