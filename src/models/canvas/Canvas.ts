import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";
import IModel from "../IModel";
import {ulid} from "ulid";

export type CanvasType = "hypothesis" | "redefinition";

@Entity()
export class Canvas implements IModel{

  @PrimaryColumn()
  id: string = ulid();

  @Column()
  title: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
  createdAt?: Date;

  // 最終更新日時を任意で制御したいので、あえて UpdateDateColumn ではなくする
  @Column({ name: 'updated_at', type: 'timestamp'})
  updatedAt?: Date;

}