import mongoose from 'mongoose';

const EmotionSchema = new mongoose.Schema({
  classification: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});


export default mongoose.model('Emotion', EmotionSchema);