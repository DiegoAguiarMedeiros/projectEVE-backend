import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { UserCreated } from "../../users/domain/events/userCreated";
import { Create as CreateEnvelope } from "../use-cases/create-all-envelope/Create";

export class AfterUserCreated implements IHandle<UserCreated> {
  private create: CreateEnvelope;

  constructor(create: CreateEnvelope) {
    this.setupSubscriptions();
    this.create = create;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<UserCreated>(this.onUserCreated.bind(this)), UserCreated.name);
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event;

    try {
      await this.create.execute({ userId: user.id.toString() })
      console.info(`[AfterUserCreated]: Successfully executed CreateEnvelope use case AfterUserCreated`)
    } catch (err) {
      console.info(`[AfterUserCreated]: Failed to execute CreateEnvelope use case AfterUserCreated.`)
    }

  }
}