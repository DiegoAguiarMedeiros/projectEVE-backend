import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { ProcessedIncomeDeleted } from "../../processed-incomes/domain/events/ProcessedIncomeDeleted";
import { ResetAll } from "../use-cases/reset-all-by-processed-incomes-id/ResetAll";

export class AfterProcessedIncomeDeleted implements IHandle<ProcessedIncomeDeleted> {
  private resetAll: ResetAll;

  constructor(resetAll: ResetAll) {
    this.setupSubscriptions();
    this.resetAll = resetAll;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<ProcessedIncomeDeleted>(this.onProcessedIncomeDeleted.bind(this)), ProcessedIncomeDeleted.name);
  }

  private async onProcessedIncomeDeleted(event: ProcessedIncomeDeleted): Promise<void> {
    const { processedIncomes } = event;
    try {
      await this.resetAll.execute({
        processedIncomesId: processedIncomes.id.toString(),
        userId: processedIncomes.userId.value,
        year: processedIncomes.year.value,
        month: processedIncomes.month.value,
      });
      console.info(`[AfterProcessedIncomeDeleted]: Successfully reset transactions for processedIncomesId ${processedIncomes.id}`);
    } catch (err) {
      console.info(`[AfterProcessedIncomeDeleted]: Failed to reset transactions for processedIncomesId ${processedIncomes.id}`);
    }
  }
}
