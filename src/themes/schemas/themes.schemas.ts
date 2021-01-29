import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';


export const ThemesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
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
ThemesSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.is_deleted;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.sequence;
  }
});