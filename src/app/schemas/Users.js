import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  emotions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Emotion',
    }
  ]
}, {
  timestamps: true,
});


export default mongoose.model('User', UserSchema);