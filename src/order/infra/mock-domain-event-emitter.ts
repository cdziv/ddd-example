import { DomainEventEmitter } from '../../common';

export class MockDomainEventEmitter implements DomainEventEmitter {
  /**
   * @note just for demo
   */
  async emit(...args: any[]): Promise<void> {
    return;
  }
}
