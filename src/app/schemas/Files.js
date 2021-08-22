import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  name: { type: String },
  path: { type: String },
}, {
  timestamps: true,
});

FileSchema.virtual('url').get(function() {
  return `https://localhost:3000/files/${this.path}`;
});

FileSchema.set('toObject', { virtuals: true });
FileSchema.set('toJSON', { virtuals: true });

export default mongoose.model('File', FileSchema);