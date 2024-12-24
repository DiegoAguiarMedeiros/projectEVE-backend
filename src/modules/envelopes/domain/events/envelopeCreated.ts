
import { Envelope } from "../envelope";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export class EnvelopeCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: Envelope;

  constructor(user: Envelope) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}