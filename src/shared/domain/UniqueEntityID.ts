
import { v4 as uuid_v4 } from "uuid";
import { Identifier } from './Identifier'

export class UniqueEntityID extends Identifier<string | number>{
  constructor(id?: string | number) {
    super(id || uuid_v4())
  }
}