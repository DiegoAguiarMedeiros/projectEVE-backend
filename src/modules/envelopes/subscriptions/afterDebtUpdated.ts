import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DebtUpdated } from "../../debts/domain/events/debtUpdated";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update";
import { Repository as EnvelopeRepo } from "../repos/implementation/Repository";

export class AfterDebtUpdated implements IHandle<DebtUpdated> {
  private update: UpdateEnvelope;
  private envelopeRepo: EnvelopeRepo;

  constructor(update: UpdateEnvelope, envelopeRepo: EnvelopeRepo) {
    this.setupSubscriptions();
    this.update = update;
    this.envelopeRepo = envelopeRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<DebtUpdated>(this.onDebtUpdated.bind(this)), DebtUpdated.name);
  }

  private async onDebtUpdated(event: DebtUpdated): Promise<void> {
    const { debt } = event;
    try {
      const envelope = await this.envelopeRepo.getOnlyById(debt.envelopeId.value);
      if (!envelope) return;
      await this.update.execute({ incomeId: '', userId: envelope.userId.value });
      console.info(`[AfterDebtUpdated]: Successfully executed update envelope use case AfterDebtUpdated`)
    } catch (err) {
      console.info(`[AfterDebtUpdated]: Failed to execute update envelope use case AfterDebtUpdated.`)
    }
  }
}
