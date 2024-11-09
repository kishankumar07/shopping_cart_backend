import mongoose, { Document, Types } from 'mongoose';

export interface Customer extends Document {
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: Types.ObjectId[];
  cart: { product: Types.ObjectId; unit: number }[];
  wishlist: Types.ObjectId[];
  orders:Types.ObjectId[]
}

const CustomerSchema = new mongoose.Schema({
  email: String,
  password: String,
  salt: String,
  phone: String,
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'address',
      require: true,
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        require: true,
      },
      unit: {
        type: Number,
        require: true,
      },
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      require: true,
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
      require: true,
    },
  ],
},
{
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.salt;
      delete ret.__v;
    }
  },
  timestamps: true
});

export default mongoose.model<Customer>('customer', CustomerSchema);
