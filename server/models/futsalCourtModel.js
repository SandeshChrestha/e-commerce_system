import mongoose from 'mongoose';

const futsalCourtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Indoor', 'Outdoor', 'Premium'],
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    facilities: [{
      type: String,
    }],
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    availableDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    }],
    image: {
      type: String,
      default: '/images/default-court.jpg',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FutsalCourt = mongoose.model('FutsalCourt', futsalCourtSchema);

export default FutsalCourt; 