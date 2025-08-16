import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { IncomesCreated } from "../../incomes/domain/events/IncomesCreated";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update"

export class AfterIncomesCreated implements IHandle<IncomesCreated> {
  private update: UpdateEnvelope;

  constructor(update: UpdateEnvelope) {
    this.setupSubscriptions();
    this.update = update;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<IncomesCreated>(this.onIncomesCreated.bind(this)), IncomesCreated.name);
  }

  private async onIncomesCreated(event: IncomesCreated): Promise<void> {
    const { incomes } = event;
    try {
      await this.update.execute({ incomeId: incomes.id.toString(), userId: incomes.userId.value });
      console.info(`[AfterIncomesCreated]: Successfully executed update transactions use case AfterIncomesCreated`)
    } catch (err) {
      console.info(`[AfterIncomesCreated]: Failed to execute update transactions use case AfterIncomesCreated.`)
    }

  }
}