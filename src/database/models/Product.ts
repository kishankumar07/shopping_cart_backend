import mongoose, { Document, ObjectId } from 'mongoose'

export interface Product extends Document{
    name:string;desc:string;banner:string;type:string;unit:number;price:number;available:boolean;supplier:string;_id:ObjectId
}

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
      name: String,
      desc: String,
      banner: String,
      type: String,
      unit: Number,
      price: Number,
      available: Boolean,
      supplier: String
  });

  export default mongoose.model('product',ProductSchema)


//   Argument of type '{ product: Schema.Types.ObjectId; unit: number; }' is not assignable to parameter of type '{ product: ObjectId; unit: number; }'.
// Types of property 'product' are incompatible.
// Type 'ObjectId' is missing the following properties from type 'ObjectId': _bsontype, id, toHexString, toJSON, and 4 more.ts(2345)
