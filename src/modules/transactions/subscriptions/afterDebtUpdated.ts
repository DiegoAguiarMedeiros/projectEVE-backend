import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DebtUpdated } from "../../debts/domain/events/debtUpdated";
import { Create } from "../use-cases/create-after-debt/Create";

export class AfterDebtUpdated implements IHandle<DebtUpdated> {
  private create: Create;

  constructor(create: Create) {
    this.setupSubscriptions();
    this.create = create;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<DebtUpdated>(this.onDebtUpdated.bind(this)), DebtUpdated.name);
  }

  private async onDebtUpdated(event: DebtUpdated): Promise<void> {
    const { debt } = event;
    try {
      await this.create.execute({ debtId: debt.id.toString() });
      console.info(`[AfterDebtUpdated]: Successfully recreated transactions after debt update`)
    } catch (err) {
      console.info(`[AfterDebtUpdated]: Failed to recreate transactions after debt update.`)
    }
  }
}
