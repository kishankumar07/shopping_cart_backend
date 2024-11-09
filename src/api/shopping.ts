import { Application } from "express";
import userAuth from "./middleware/userAuth";
import ShoppingService from "../services/shopping-service";
import CustomerService from "../services/customer-service";
import { payloadType } from "../utils";

export default (app:Application) =>{
      const service = new ShoppingService();
      const userService = new CustomerService()

//-----------------------------------------------------------------------

        //@Desc     To place an order
        //POST     /shopping/order
        //Access    Private
      app.post('/shopping/order',userAuth,async(req,res,next)=>{
            const { _id } = req.user;
            const { txnNumber } = req.body;
            try {
                  const response = await service.PlaceOrder({_id, txnNumber});
                   if(response && response.data){
                        res.status(200).json(response.data)
                   }
            } catch (error) {
                  next()
            }
      })
//----------------------------------------------------------------------------
      //Desc      To get all shopping details
      //GET       /shopping/orders
      //Access    Private
      app.get('/shopping/orders',userAuth, async (req,res,next) => {
  
            const { _id } = req.user as payloadType;
    
            try {
                const response = await userService.GetShoppingDetails(_id);
                if(response && response.data){
                  res.status(200).json(response.data)
             }
             return;
            } catch (err) {
                next(err);
            }
    
        });

//-----------------------------------------------------------------------

        //Desc    
        app.get('/shopping/cart', userAuth, async (req,res,next) => {
  
            const { _id } = req.user;
            try {
                const response = await userService.GetShoppingDetails(_id);
                if(response && response.data){
                  res.status(200).json(response.data)
             }
                 return;
            } catch (err) {
                next(err);
            }
        });
}