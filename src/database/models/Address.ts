import mongoose, { Document } from "mongoose";

export interface Address extends Document{
      street:string;
      postalCode:string;
      city:string;
      country:string;
}

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
      street:String,
      postalCode:String,
      city:String,
      country:String,
})

export default mongoose.model('address',AddressSchema)