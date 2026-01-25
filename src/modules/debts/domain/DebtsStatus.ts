export type DebtsStatus = 'transaction.status.pending' | 'paid' | 'overdue';

export const allDebtsStatus: DebtsStatus[] = ['transaction.status.pending', 'paid', 'overdue']