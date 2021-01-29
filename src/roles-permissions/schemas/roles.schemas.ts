import * as mongoose from 'mongoose';

export const RolesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  is_primary_role: {
    type: Boolean,
    default: false
  },
  permissions: [{
    type: String,
    required: true,
  }],
  is_deleted: {
    type: Boolean, 
    default: false,
  }
}, { timestamps: true, versionKey: false });

//Remove delete_status and timestamps
RolesSchema.set('toJSON', {
  transform: (doc, ret) => {
      delete ret.is_deleted;
      delete ret.createdAt;
      delete ret.updatedAt;
  }
});