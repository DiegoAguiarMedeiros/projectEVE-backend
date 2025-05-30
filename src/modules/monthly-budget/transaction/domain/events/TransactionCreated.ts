// domain/events/TransactionCreated.ts
export class TransactionCreated {
  constructor(public readonly transactionId: string) {}
}
