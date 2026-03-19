import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { TransactionsUpdated } from "../../transactions/domain/events/TransactionsUpdated";
import { Update as UpdateEnvelope } from "../use-cases/update-after-transaction-update/Update"

export class AfterTransactionsUpdated implements IHandle<TransactionsUpdated> {
  private update: UpdateEnvelope;

  constructor(update: UpdateEnvelope) {
    this.setupSubscriptions();
    this.update = update;
  }

  setupSubscriptions(): void {
    DomainEvents.register(DomainEvents.asDomainEventHandler<TransactionsUpdated>(this.onTransactionsUpdated.bind(this)), TransactionsUpdated.name);
  }

  private async onTransactionsUpdated(event: TransactionsUpdated): Promise<void> {
    const { transactions } = event;
    try {
      await this.update.execute({
        transactionId: transactions.id.toString(),
        oldAmount: event.oldAmount.value,
        newAmount: event.newAmount.value,
        oldStatus: event.oldStatus,
        userId: event.userId.toString(),
      });
      console.info(`[AfterTransactionsUpdated]: Successfully executed update transactions use case AfterTransactionsUpdated`)
    } catch (err) {
      console.info(`[AfterTransactionsUpdated]: Failed to execute update transactions use case AfterTransactionsUpdated.`)
    }

  }
}