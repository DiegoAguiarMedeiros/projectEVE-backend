import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Transactions } from "../Transactions";


export class TransactionsCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public transactions: Transactions;

  constructor (transactions: Transactions) {
    this.dateTimeOccurred = new Date();
    this.transactions = transactions;
  }
  
  getAggregateId (): UniqueEntityID {
    return this.transactions.id;
  }
}