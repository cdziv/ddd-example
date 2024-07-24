/**
 *
 * @note 此為簡單實踐版本，可視需求進行擴充。例如增加 eventId, payload,
 * 和 timestamp, correlationId, causationId 等 metadata。
 */
export abstract class DomainEvent {
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }
}
