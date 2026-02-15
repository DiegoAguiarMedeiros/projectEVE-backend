import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DebtDeleted } from "../../debts/domain/events/debtDeleted";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update";
import { Repository as EnvelopeRepo } from "../repos/implementation/Repository";

export class AfterDebtDeleted implements IHandle<DebtDeleted> {
  private update: UpdateEnvelope;
  private envelopeRepo: EnvelopeRepo;

  constructor(update: UpdateEnvelope, envelopeRepo: EnvelopeRepo) {
    this.setupSubscriptions();
    this.update = update;
    this.envelopeRepo = envelopeRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<DebtDeleted>(this.onDebtDeleted.bind(this)), DebtDeleted.name);
  }

  private async onDebtDeleted(event: DebtDeleted): Promise<void> {
    const { debt } = event;
    try {
      const envelope = await this.envelopeRepo.getOnlyById(debt.envelopeId.value);
      if (!envelope) return;
      await this.update.execute({ incomeId: '', userId: envelope.userId.value });
      console.info(`[AfterDebtDeleted]: Successfully executed update envelope use case AfterDebtDeleted`)
    } catch (err) {
      console.info(`[AfterDebtDeleted]: Failed to execute update envelope use case AfterDebtDeleted.`)
    }
  }
}
