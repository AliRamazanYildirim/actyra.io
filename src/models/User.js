import {Schema, model, models} from 'mongoose';

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    fullName: { type: String },
    role: { type: String, enum: ['admin', 'veranstalter', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.User || model('User', userSchema);
