import { Balance } from "../../../../shared/domain/Balance";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Transactions } from "../Transactions";
import { TransactionsStatus } from "../TransactionsStatus";


export class TransactionsUpdated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public transactions: Transactions;
  public oldAmount: Balance;
  public newAmount: Balance;
  public oldStatus: TransactionsStatus;
  public userId: UniqueEntityID;

  constructor(transactions: Transactions, oldAmount: Balance, newAmount: Balance, oldStatus: TransactionsStatus, userId: UniqueEntityID) {
    this.dateTimeOccurred = new Date();
    this.transactions = transactions;
    this.oldAmount = oldAmount;
    this.newAmount = newAmount;
    this.oldStatus = oldStatus;
    this.userId = userId;
  }

  getAggregateId(): UniqueEntityID {
    return this.transactions.id;
  }
}