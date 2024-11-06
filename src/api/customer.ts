import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer-service"


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
                  
            }
      })
}