import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 26,
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
    max: 24,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  emotions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emotion',
    }
  ],
}, {
  timestamps: true,
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch(err) {
    return next(err);
  }
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  try {
    if(this._update.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this._update.password, salt);4
      this._update.password = hashedPassword;
    }
    next();
  } catch(err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

export default mongoose.model('User', UserSchema);