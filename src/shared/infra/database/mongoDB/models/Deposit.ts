import mongoose, { Schema, Document } from 'mongoose';

export interface IDeposit extends Document {
    amount: number;
    date: Date;
    envelopeId: mongoose.Types.ObjectId; // Relacionamento com o envelope
}

const DepositSchema = new Schema<IDeposit>({
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    envelopeId: { type: Schema.Types.ObjectId, ref: 'Envelope', required: true }, // Relacionamento com o envelope
}, { timestamps: true });

const DepositModel = mongoose.model<IDeposit>('Deposit', DepositSchema);

export { DepositModel, DepositSchema };
