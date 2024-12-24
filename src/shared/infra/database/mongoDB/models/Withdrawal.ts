import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
    amount: number;
    date: Date;
    envelopeId: mongoose.Types.ObjectId; // Relacionamento com o envelope
}

const WithdrawalSchema = new Schema<IWithdrawal>({
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    envelopeId: { type: Schema.Types.ObjectId, ref: 'Envelope', required: true }, // Relacionamento com o envelope
}, { timestamps: true });

const WithdrawalModel = mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

export { WithdrawalModel, WithdrawalSchema };
