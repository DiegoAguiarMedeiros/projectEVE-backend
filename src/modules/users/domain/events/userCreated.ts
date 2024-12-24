
import { User } from "../user";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { CreateEnvelopeUseCase } from "../../../envelopes/useCases/createEnvelope/CreateEnvelopeUseCase";
import envelopes from "../../../../shared/data/envelope";

export class UserCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: User;
  public createEnvelopeUseCase: CreateEnvelopeUseCase;

  constructor(user: User, createEnvelopeUseCase: CreateEnvelopeUseCase) {
    this.dateTimeOccurred = new Date();
    this.user = user;
    this.createEnvelopeUseCase = createEnvelopeUseCase;
    this.createEnvelope();
  }

  // Método para gerar o envelope (apenas um console.log neste caso)
  private createEnvelope() {
    envelopes.forEach(envelope => {
      console.log("createEnvelope", envelope);
      this.createEnvelopeUseCase.execute({ name: envelope, userId: `${this.getAggregateId()}` })
    })
  }



  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}