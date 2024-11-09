import { ObjectId } from "mongoose";
import { ShoppingRepository } from "../database/index"
import { FormatData } from "../utils";

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
                  
            }
      }

      async PlaceOrder(userInput:{_id:ObjectId,txnNumber:string}){
            const {_id,txnNumber} = userInput;
            try {
                  const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
                  return FormatData(orderResult);
                } catch (err) {
                  // throw new APIError("Data Not found", err);
                }
      }

}