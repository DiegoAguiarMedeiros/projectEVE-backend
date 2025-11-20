import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { ProcessedIncomes } from "../ProcessedIncomes";


export class ProcessedIncomeUpdated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public processedIncomes: ProcessedIncomes;

  constructor (processedIncomes: ProcessedIncomes) {
    console.log("ProcessedIncomeUpdated constructor")
    this.dateTimeOccurred = new Date();
    this.processedIncomes = processedIncomes;
  }
  
  getAggregateId (): UniqueEntityID {
    return this.processedIncomes.id;
  }
}