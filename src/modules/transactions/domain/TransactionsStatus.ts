export type TransactionsStatus =
    | 'transaction.status.pending'
    | 'transaction.status.completed'
    | 'transaction.status.overdue'
    | 'transaction.status.cancelled';

export const allTransactionsStatus: TransactionsStatus[] = [
    'transaction.status.pending',
    'transaction.status.completed',
    'transaction.status.overdue',
    'transaction.status.cancelled'
]