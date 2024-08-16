import mongoose from 'mongoose';

const flashSetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    set: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true },
        }
    ]
});

const FlashSet = mongoose.models.FlashSet || mongoose.model('FlashSet', flashSetSchema);
export default FlashSet;