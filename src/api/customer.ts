import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer-service"
import userAuth from "./middleware/userAuth";
import { JwtPayload } from "jsonwebtoken";
import { payloadType } from "../utils";


export default (app:Application) =>{
      const service = new CustomerService() 
      
            //DESC      Register a customer
            // POST     /customer/signup
            // Access   Public
      app.post('/customer/signup', async(req:Request,res:Response,next:NextFunction) =>{
            try {
                  const { email, password, phone } = req.body;
                  const response = await service.SignUp({ email, password, phone });

                  if (response) {
                        // console.log('response to come:',response)
                        res.cookie('authToken', response.data.token, { 
                              httpOnly: true, 
                              secure: process.env.NODE_ENV === 'production',
                              sameSite: 'strict' 
                          }).status(201).json({ created_details: response.data.details });
                          
                  } else {
                        res.status(400).json({ message: 'Unable to sign up customer' });
                  }
            } catch (error) {
                  console.error('Error in /customer/signup:', error);
                  res.status(500).json({
                      message: 'An error occurred during signup. Please try again later.'
                  });
            }
      })

            //DESC      Login a user
            // POST     /customer/login
            // Access   Public
            app.post("/customer/login", async (req:Request, res:Response, next:NextFunction) => {
                  try {
                    const { email, password } = req.body;
              
                    const response  = await service.SignIn({ email, password });
              
                   if(response && response.data){
                        res.cookie('authToken', response.data.token, { 
                              httpOnly: true, 
                              secure: process.env.NODE_ENV === 'production',
                              sameSite: 'strict' 
                          }).status(200).json({customer_details:response.data.details})
                   }else {
                        res.status(400).json({ message: 'Incorrect password | User does not exist' });
                  }
                  } catch (err) {
                        console.error('Error in /customer/login:', err);

                        // Send an error response to the client
                        res.status(500).json({
                            message: 'An error occurred during login. Please try again later.'
                        });
                  }
                });

            //DESC      Add address
            // POST     /customer/address
            // Access   Private
          app.post("/customer/address", userAuth, async (req:Request, res:Response, next:NextFunction):Promise<void> => {
            try {
              const { _id } = req.user as payloadType;
        
              const { street, postalCode, city, country } = req.body;
        
              const response = await service.AddNewAddress(_id, {
                street,
                postalCode,
                city,
                country,
              });
        
              if(response && response.data){
                  res.status(200).json({customer_details:response.data})
              }else {
                  res.status(400).json({ message: 'Incorrect password | User does not exist' });
              }
            } catch (err) {
              next(err);
            }
          });

            //DESC      Get user profile
            // GET     /customer/profile
            // Access   Private
            app.get("/customer/profile", userAuth, async (req, res, next) => {
                  try {
                    const { _id } = req.user as payloadType;
                    const response = await service.GetProfile( _id );
                    if(response && response.data){
                        res.status(200).json({customer_details:response.data})
                    }
                     return
                  } catch (err) {
                    next(err);
                  }
                });

            //DESC      Get shopping details of customer
            // GET     /customer/shopping-details
            // Access   Private
          app.get("/customer/shopping-details", userAuth, async (req, res, next) => {
            try {
              const { _id } = req.user as payloadType;
              const response = await service.GetShoppingDetails(_id);
        
              if(response && response.data){
                  res.status(200).json({customer_details:response.data})
              }
               return;
            } catch (err) {
              next(err);
            }
          });

            //DESC      Get wishlist of customer
            // GET     /customer/wishlist
            // Access   Private
            app.get("/customer/wishlist", userAuth, async (req, res, next) => {
                  try {
                    const { _id } = req.user as payloadType;
                    const response = await service.GetWishList(_id);
                    if(response && response.data){
                        res.status(200).json({customer_details:response.data})
                    }
                    return
                  } catch (err) {
                    next(err);
                  }
                });

}