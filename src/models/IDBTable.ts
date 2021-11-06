import { EntityManager } from "typeorm";

export default interface IDBTable<T> {
  find(condition: object): Promise<T[] | null>
  count(condition: object): Promise<number | undefined>
  findById(id: string): Promise<T | null>
  findBy(fieldName: string, value: string): Promise<T | undefined>
  findAll(): Promise<T[]>
  save(model: T): Promise<T>
  bulkSave(models: T[]): Promise<T[]>
  delete(id: string): Promise<void>
  clear(): Promise<void>
  softDelete(id: string): Promise<void>
  /**
   * typeormの記述に依存しないように他の記述同様objectにすべきかもしれませんが
   * 使いやすさの観点から(インテリセンスなど)EntityManagerで書きました
   */
  withTx<U>(f: (tx: EntityManager) => Promise<U>): Promise<U>;
  query<U>(stmt: string, parameter: any[]): Promise<U>
}
