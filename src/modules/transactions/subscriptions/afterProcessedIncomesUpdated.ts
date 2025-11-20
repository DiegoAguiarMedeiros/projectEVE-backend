import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { ProcessedIncomeUpdated } from "../../processed-incomes/domain/events/ProcessedIncomeUpdated";
import { Create } from "../use-cases/create-after-processed-incomes/Create";

export class AfterProcessedIncomeUpdated implements IHandle<ProcessedIncomeUpdated> {
  private create: Create;

  constructor(create: Create) {
    this.setupSubscriptions();
    this.create = create;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<ProcessedIncomeUpdated>(this.onProcessedIncomeUpdated.bind(this)), ProcessedIncomeUpdated.name);
  }

  private async onProcessedIncomeUpdated(event: ProcessedIncomeUpdated): Promise<void> {
    const { processedIncomes } = event;

    try {
      await this.create.execute({ processedIncomesId: processedIncomes.id.toString() })
      console.info(`[AfterProcessedIncomeUpdated]: Successfully executed Create Transactions use case AfterProcessedIncomeUpdated`)
    } catch (err) {
      console.info(`[AfterProcessedIncomeUpdated]: Failed to execute Create Transactions use case AfterProcessedIncomeUpdated.`)
    }

  }
}