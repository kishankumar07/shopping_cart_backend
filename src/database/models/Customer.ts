import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
      email:String,
      password:String,
      salt:String,
      phone:String,
      address:[
            {
                  type:Schema.Types.ObjectId,
                  ref:'address',
                  require:true,
            }
      ],
      cart:[
            {
                  product:{
                        type:Schema.Types.ObjectId,
                        ref:'product',
                        require:true,
                  },
                  unit:{
                        type:Number,
                        require:true
                  }
            }
      ],
      wishlist:[
            {
                  type:Schema.Types.ObjectId,
                  ref:'product',
                  require:true
            }
      ]
},{
      toJSON:{
            transform(doc,ret){
                  delete ret.password;
                  delete ret.salt;
                  delete ret.__v;
            }
      },
      timestamps:true
})
export default mongoose.model('customer',CustomerSchema);