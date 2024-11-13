import { Application } from "express";
import userAuth from "./middleware/userAuth";
import ShoppingService from "../services/shopping-service";
import CustomerService from "../services/customer-service";
import { payloadType } from "../utils";

export default (app:Application) =>{
      const service = new ShoppingService();
      const userService = new CustomerService()

//-----------------------------------------------------------------------
     /**
   * @swagger
   * /shopping/order:
   *   post:
   *     summary: Place an order
   *     tags: [Shopping]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               txnNumber:
   *                 type: string
   *     responses:
   *       200:
   *         description: Order placed successfully
   *       403:
   *         description: Not authorized
   */


      app.post('/shopping/order',userAuth,async(req,res,next)=>{
            const { _id } = req.user;
            const { txnNumber } = req.body;
            try {
                  const response = await service.PlaceOrder({_id, txnNumber});
                   if(response && response.data){
                        res.status(200).json(response.data)
                   }
            } catch (error) {
                  next(error)
            }
      })
//----------------------------------------------------------------------------

 /**
   * @swagger
   * /shopping/orders:
   *   get:
   *     summary: get all the orders
   *     description: Get all shopping orders
   *     tags: [Shopping]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
   *       500:
   *         description: Internal server error
   */

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

 /**
   * @swagger
   * /shopping/cart:
   *   get:
   *     summary: Get user cart details
   *     description: Get shopping cart details
   *     tags: [Shopping]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Cart details retrieved successfully
   *       500:
   *         description: Internal server error
   */


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