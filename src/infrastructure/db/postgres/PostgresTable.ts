import IDBTable from "../../../models/IDBTable";
import {
  Connection,
  createConnection,
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindConditions,
  getConnectionManager,
  getConnectionOptions,
} from "typeorm";
import {entities} from "../../../models/entities";

export class PostgresTable<T> implements IDBTable<T> {
  private connection: Connection = null;
  readonly model: EntityTarget<T>;

  constructor(model: EntityTarget<T>) {
    this.model = model
  }

  async withTx<U>(f: (tx: EntityManager) => Promise<U>) {
    if (!this.connection) await this._getTypeormRepository()
    return this.connection.transaction(f)
  }

  private async _getTypeormRepository() {

    try {
      this.connection  = getConnectionManager().get(PostgresTable._getConnectionName());
    } catch (err) {

      // If ConnectionNotFoundError occurs, return new connection
      if (err.name === 'ConnectionNotFoundError') {
        const connectionOptions = await getConnectionOptions(PostgresTable._getConnectionName());

        // FIXME webpackとの兼ね合いで、 entity へのパスが通らない。src/infrastructure/db/typeorm/entity/index.ts に entity のクラスを列挙することで回避している
        Object.assign(connectionOptions, {entities: entities});
        this.connection = await createConnection(connectionOptions);
      }
    }
    return this.connection.getRepository(this.model);
  }

  private static _getConnectionName(): string {
    return process.env.NODE_ENV != 'test'? 'default': process.env.NODE_ENV;
  }

  async delete(id: string): Promise<void> {
    const res = await (await this._getTypeormRepository()).delete(id);
    if(typeof res.affected === 'number') {
      return null;
    } else {
      throw new Error(`Error occurred at deletion. ${JSON.stringify(res)}`);
    }
  }
  async softDelete(id: string): Promise<void> {
    const res = await (await this._getTypeormRepository()).softDelete(id);
    if(typeof res.affected === 'number') {
      return null;
    } else {
      throw new Error(`Error occurred at soft-deletion. ${JSON.stringify(res)}`);
    }
  }

  async softDeleteByConditions(condition: FindConditions<T>): Promise<void> {
    const res = await (await this._getTypeormRepository()).softDelete(condition);
    if(typeof res.affected === 'number') {
      return null;
    } else {
      throw new Error(`Error occurred at soft-deletion. ${JSON.stringify(res)}`);
    }
  }

  async findById(id: string): Promise<T | undefined> {
    return (await this._getTypeormRepository()).findOne(id);
  }

  async find(condition: object): Promise<T[] | undefined> {
    return (await this._getTypeormRepository()).find(condition);
  }

  async count(condition: object): Promise<number | undefined> {
    return (await this._getTypeormRepository()).count(condition);
  }

  async findBy(fieldName: string, value: string): Promise<T | undefined> {
    var where = {};
    where[fieldName] = value;
    return (await this._getTypeormRepository()).findOne({
      where: [where]
    });
  }

  async findAll(): Promise<T[]> {
    return (await this._getTypeormRepository()).find();
  }

  async save(model: T): Promise<T> {
    return (await this._getTypeormRepository()).save(model as DeepPartial<T>);
  }

  async bulkSave(models: T[]): Promise<T[]> {
    return (await this._getTypeormRepository()).save(models as DeepPartial<T>[]);
  }

  async clear(): Promise<void> {
    const repo = (await this._getTypeormRepository());
    return repo.query(`DELETE FROM "${repo.metadata.tableName}"`);
  }

  async query<U>(stmt: string, parameter: any[]): Promise<U> {
    const repo = await this._getTypeormRepository()
    return repo.query(stmt, parameter)
  } 
}
