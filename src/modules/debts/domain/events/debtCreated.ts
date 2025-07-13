
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Debt } from "../Debt";


export class DebtCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public debt: Debt;
  
  constructor (debt: Debt) {
    this.dateTimeOccurred = new Date();
    this.debt = debt;
  }
  
  getAggregateId (): UniqueEntityID {
    return this.debt.id;
  }
}