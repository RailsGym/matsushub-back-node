import IDBTable from "../IDBTable"
import { Canvas } from "./Canvas"

export default class CanvasRepository {
  constructor(
    private _table: IDBTable<Canvas>,
  ) {
  }

  async findAll(): Promise<Canvas[]> {
    return this._table.findAll();
  }
}
