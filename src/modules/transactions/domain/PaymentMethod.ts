export type PaymentMethod =
    | 'envelope.transaction.payment_method.CreditCard'
    | 'envelope.transaction.payment_method.DebitCard'
    | 'envelope.transaction.payment_method.Cash'
    | 'envelope.transaction.payment_method.BankTransfer'
    | 'envelope.transaction.payment_method.Pix'
    | 'envelope.transaction.payment_method.Ticket'
    | 'envelope.transaction.payment_method.Reallocation';

export const allPaymentMethod: PaymentMethod[] = [
    'envelope.transaction.payment_method.CreditCard',
    'envelope.transaction.payment_method.DebitCard',
    'envelope.transaction.payment_method.Cash',
    'envelope.transaction.payment_method.BankTransfer',
    'envelope.transaction.payment_method.Pix',
    'envelope.transaction.payment_method.Ticket',
    'envelope.transaction.payment_method.Reallocation'
];