import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
