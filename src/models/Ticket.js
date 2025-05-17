import { Schema, model, models } from 'mongoose';

const TicketSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    index: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  totalDonation: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  orderNumber: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  customerName: String,
  customerEmail: String,
  paymentMethod: String,
  // Neu hinzugefügte Felder
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String
}, {
  timestamps: true
});

export default models.Ticket || model('Ticket', TicketSchema);