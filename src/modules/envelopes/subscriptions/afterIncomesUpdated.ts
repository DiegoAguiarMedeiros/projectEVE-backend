import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { IncomesUpdated } from "../../incomes/domain/events/IncomesUpdated";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update";

export class AfterIncomesUpdated implements IHandle<IncomesUpdated> {
  private update: UpdateEnvelope;

  constructor(update: UpdateEnvelope) {
    this.setupSubscriptions();
    this.update = update;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<IncomesUpdated>(this.onIncomesUpdated.bind(this)), IncomesUpdated.name);
  }

  private async onIncomesUpdated(event: IncomesUpdated): Promise<void> {
    const { incomes } = event;
    try {
      await this.update.execute({ incomeId: incomes.id.toString(), userId: incomes.userId.value });
      console.info(`[AfterIncomesUpdated]: Successfully executed update envelope use case AfterIncomesUpdated`);
    } catch (err) {
      console.info(`[AfterIncomesUpdated]: Failed to execute update envelope use case AfterIncomesUpdated.`);
    }
  }
}
