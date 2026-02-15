import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DebtCreated } from "../../debts/domain/events/debtCreated";
import { Update as UpdateEnvelope } from "../use-cases/update-after-income/Update";
import { Repository as EnvelopeRepo } from "../repos/implementation/Repository";

export class AfterDebtCreated implements IHandle<DebtCreated> {
  private update: UpdateEnvelope;
  private envelopeRepo: EnvelopeRepo;

  constructor(update: UpdateEnvelope, envelopeRepo: EnvelopeRepo) {
    this.setupSubscriptions();
    this.update = update;
    this.envelopeRepo = envelopeRepo;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<DebtCreated>(this.onDebtCreated.bind(this)), DebtCreated.name);
  }

  private async onDebtCreated(event: DebtCreated): Promise<void> {
    const { debt } = event;
    try {
      const envelope = await this.envelopeRepo.getOnlyById(debt.envelopeId.value);
      if (!envelope) return;
      await this.update.execute({ incomeId: '', userId: envelope.userId.value });
      console.info(`[AfterDebtCreated]: Successfully executed update envelope use case AfterDebtCreated`)
    } catch (err) {
      console.info(`[AfterDebtCreated]: Failed to execute update envelope use case AfterDebtCreated.`)
    }
  }
}
