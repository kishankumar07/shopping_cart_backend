import mongoose, { Mongoose, ObjectId } from "mongoose";
import { CustomerModel, OrderModel } from "../models";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../models/Product";
import { APIError, AppError, STATUS_CODES } from "../../utils/app-errors";

interface CartItem {
      product: Product; 
      unit: number;
  }
  


export default class ShoppingRepository {
      async Orders(customerId:ObjectId){
            try {
                  const orders = await OrderModel.find({customerId}).populate('items.product');
                  return orders;
            } catch (error) {
                console.error('Error in Placing order:', error);
                throw new AppError('Error Fetching orders', 500, 'Unable to fetch the order', true);
            }
      }
      async CreateNewOrder(customerId:ObjectId, txnId:string){
          
          try{
            const profile = await CustomerModel.findById(customerId).populate<{ cart: CartItem[] }>('cart.product');

            // console.log('this is the profile:',profile)/
              if(profile){
                  
                  let amount = 0;   
      
                  let cartItems = profile.cart as CartItem[];
                  // console.log('these are the cart items:',cartItems)
      
                  if(cartItems.length > 0){
                      //process Order
                      cartItems.forEach((item) => {
                        amount += item.product.price * item.unit;  // price is now accessible on Product
                    });
          
                      const orderId = uuidv4();
                  //     console.log('orderId for unique id:',orderId)
          
                      const order = new OrderModel({
                          orderId,
                          customerId,
                          amount,
                          txnId,
                          status: 'received',
                          items: cartItems
                      })
                  //     console.log('this is the order:',order)
                  //The next line : once order is created, cart is empty right
                      profile.cart = [];
                      
                      order.populate('items.product');
                      const orderResult = await order.save();
                  //     console.log('this is the orderResult:',orderResult)
                     
                      profile.orders.push(orderResult._id as mongoose.Types.ObjectId);
      
                      await profile.save();
      
                      return orderResult;
                  }
              }
      
            // return {}
  
          }catch(err){
            console.log('error at createNewOrder-----------------------------------:',err)
              throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
          }
          
  
      }
}
  
