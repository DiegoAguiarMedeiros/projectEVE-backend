import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Incomes } from "../Income";


export class IncomesDeleted implements IDomainEvent {
  public dateTimeOccurred: Date;
  public incomes: Incomes;

  constructor (incomes: Incomes) {
    this.dateTimeOccurred = new Date();
    this.incomes = incomes;
  }
  
  getAggregateId (): UniqueEntityID {
    return this.incomes.id;
  }
}