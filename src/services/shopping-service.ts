import { ObjectId } from "mongoose";
import { ShoppingRepository } from "../database/index"
import { FormatData } from "../utils";
import { AppError } from "../utils/app-errors";

export default class ShoppingService{
      private repository : ShoppingRepository
      constructor(){
            this.repository = new ShoppingRepository()
      }

      async GetOrders(customerId:ObjectId){
            try {
                  const orders = await this.repository.Orders(customerId);
                  return FormatData(orders);
            } catch (error) {
                  console.error('Error in GetOrders:', error);
                  throw new AppError('Error getting orders from database', 500, 'Unable to get the orders', true);
            }
      }

      async PlaceOrder(userInput:{_id:ObjectId,txnNumber:string}){
            const {_id,txnNumber} = userInput;
            try {
                  const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
                  return FormatData(orderResult);
                } catch (error) {
                  console.error('Error in Placing order:', error);
                  throw new AppError('Error Placing orders', 500, 'Unable to place the order', true);
                }
      }

}