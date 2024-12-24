import mongoose, { Schema, Document } from 'mongoose';

export interface IEnvelope extends Document {
    name: string;
    balance: number;
    userId: string;
}

const EnvelopeSchema = new Schema<IEnvelope>({
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    userId: { type: String, required: true },
}, { timestamps: true });

const EnvelopeModel = mongoose.model<IEnvelope>('Envelope', EnvelopeSchema);

export { EnvelopeModel, EnvelopeSchema };
