import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { IncomesDeleted } from "../../incomes/domain/events/IncomesDeleted";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update"

export class AfterIncomesDeleted implements IHandle<IncomesDeleted> {
  private update: UpdateEnvelope;

  constructor(update: UpdateEnvelope) {
    this.setupSubscriptions();
    this.update = update;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<IncomesDeleted>(this.onIncomesDeleted.bind(this)), IncomesDeleted.name);
  }

  private async onIncomesDeleted(event: IncomesDeleted): Promise<void> {
    const { incomes } = event;
    try {
      await this.update.execute({ incomeId: incomes.id.toString(), userId: incomes.userId.value });
      console.info(`[AfterIncomesDeleted]: Successfully executed update transactions use case AfterIncomesDeleted`)
    } catch (err) {
      console.info(`[AfterIncomesDeleted]: Failed to execute update transactions use case AfterIncomesDeleted.`)
    }

  }
}