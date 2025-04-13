
import { UniqueEntityID } from "./UniqueEntityID";
import { Entity } from "./Entity";
import { Result } from "./core/Result";


export class Id extends Entity<any> {


  private constructor(id: UniqueEntityID) {
    super(null, id)
  }

  public static create(id: UniqueEntityID): Result<Id> {
    return Result.ok<Id>(new Id(id));
  }
}