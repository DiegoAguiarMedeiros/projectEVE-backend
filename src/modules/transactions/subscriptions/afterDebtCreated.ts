import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DebtCreated } from "../../debts/domain/events/debtCreated";
import { Create as CreateEnvelope } from "../use-cases/create-after-debt/Create"

export class AfterDebtCreated implements IHandle<DebtCreated> {
  private create: CreateEnvelope;

  constructor(create: CreateEnvelope) {
    this.setupSubscriptions();
    this.create = create;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<DebtCreated>(this.onDebtCreated.bind(this)), DebtCreated.name);
  }

  private async onDebtCreated(event: DebtCreated): Promise<void> {
    const { debt } = event;
    try {
      await this.create.execute({ debtId: debt.id.toString() });
      console.info(`[AfterDebtCreated]: Successfully executed create transactions use case AfterDebtCreated`)
    } catch (err) {
      console.info(`[AfterDebtCreated]: Failed to execute create transactions use case AfterDebtCreated.`)
    }

  }
}