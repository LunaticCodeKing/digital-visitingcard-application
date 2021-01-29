import * as mongoose from 'mongoose';

export const PlansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String
  },
  base_price: {
    type: Number,
    required: true,
    default: 0
  },
  discount_price: {
    type: Number,
    default: 0
  },
  discount_type: {
    type: String
  },
  discount_value: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  plan_period: {
    title: { type: String, required: true },
    plan_type: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'days',
      required: true
    },
    value: { type: Number, default: 0, required: true },
  },
  features: [{
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String }
  }],
  timezone: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true, versionKey: false });

//Remove delete_status and timestamps
PlansSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.is_deleted;
    delete ret.createdAt;
    delete ret.updatedAt;
  }
});