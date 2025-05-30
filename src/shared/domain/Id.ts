import { Result } from "../core/Result";
import { Entity } from "./Entity";
import { UniqueEntityID } from "./UniqueEntityID";



export class Id extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<Id> {
    return Result.ok<Id>(new Id(id));
  }
}