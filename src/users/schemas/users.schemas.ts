import * as mongoose from 'mongoose';

const UserTokenSchema = new mongoose.Schema({
    token: {
      type: String,
    },
    expired: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
    }
},{ _id: false })

export const UsersSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String
  },
  password: {
    type: String,
  },
  roles: { 
    type: String,
    default: 'user'
  },
  timezone: {
    type: String,
  },
  reset_password: {
    type: UserTokenSchema,
  },
  email_invitation: {
    type: UserTokenSchema,
  },
  is_super_admin:{
    type: Boolean, 
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_blocked: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean, 
    default: false,
  }
}, { timestamps: true, versionKey: false });

//Remove delete_status and timestamps
UsersSchema.set('toJSON', {
  transform: (doc, ret) => {
      delete ret.is_deleted;
      delete ret.createdAt;
      delete ret.updatedAt;
  }
});