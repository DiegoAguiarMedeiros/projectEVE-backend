import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { ProcessedIncomeCreated } from "../../processed-incomes/domain/events/ProcessedIncomeCreated";
import { Create } from "../use-cases/create-after-processed-incomes/Create";

export class AfterProcessedIncomeCreated implements IHandle<ProcessedIncomeCreated> {
  private create: Create;

  constructor(create: Create) {
    this.setupSubscriptions();
    this.create = create;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<ProcessedIncomeCreated>(this.onProcessedIncomeCreated.bind(this)), ProcessedIncomeCreated.name);
  }

  private async onProcessedIncomeCreated(event: ProcessedIncomeCreated): Promise<void> {
    const { processedIncomes } = event;

    try {
      await this.create.execute({ processedIncomesId: processedIncomes.id.toString() })
      console.info(`[AfterProcessedIncomeCreated]: Successfully executed Create Transactions use case AfterProcessedIncomeCreated`)
    } catch (err) {
      console.info(`[AfterProcessedIncomeCreated]: Failed to execute Create Transactions use case AfterProcessedIncomeCreated.`)
    }

  }
}