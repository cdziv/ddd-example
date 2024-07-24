import { AggregateRoot } from '../ddd';

/**
 * @notes 此例為簡單實作。應視需求改變實作。
 */
export type PersistOperationOptions<S = unknown> = {
  // transaction session
  session?: S;
};

/**
 * RepositoryPort 介面定義了一個 Repository 的基本操作。
 *
 * @notes 此例為簡單實作。應視需求改變實作。
 */
export interface RepositoryPort<
  AR extends AggregateRoot<any, any>,
  ID extends AR['id'] = AR['id'],
> {
  save: (entity: AR | AR[], options?: PersistOperationOptions) => Promise<void>;
  ofId: (id: ID, options?: PersistOperationOptions) => Promise<AR>;
  ofIds(ids: ID[], options?: PersistOperationOptions): Promise<AR[]>;
  delete: (id: ID | ID[], options?: PersistOperationOptions) => Promise<void>;
}
