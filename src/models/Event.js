import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [String],
    shortDescription: String,
    longDescription: String,
    category: {
      type: String,
      required: true,
      enum: [
        "kultur-musik",
        "sport-freizeit",
        "bildung-workshop",
        "business-networking",
        "gesundheit",
        "technologie-innovation",
        "messen-ausstellungen",
        "sonstige-events",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Event || model("Event", EventSchema);
