import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer-service"
import userAuth from "./middleware/userAuth";
import { JwtPayload } from "jsonwebtoken";
import { payloadType } from "../utils";
import { APIError, AppError, STATUS_CODES } from "../utils/app-errors";


export default (app:Application) =>{
      const service = new CustomerService() 
      
  /**
   * @swagger
   * /customer/signup:
   *   post:
   *     summary: Register a new customer
   *     description: Creates a new customer account.
   *     tags:
   *       - Customers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       201:
   *         description: Customer created successfully
   *       400:
   *         description: Missing Email or Signup Error
   */
      app.post('/customer/signup', async(req:Request,res:Response,next:NextFunction) =>{
            try {

               // Throwing a custom error to test error handling
               //   throw new APIError(
               //     'Intentional Error',
               //     STATUS_CODES.INTERNAL_ERROR,
              //     'This is a test error for demonstration purposes',
              //     true
              // );

                  const { email, password, phone } = req.body;

                  if (!email) {
                    throw new APIError(
                        'Missing Email',
                        STATUS_CODES.BAD_REQUEST,
                        'Email is required for signup',
                        true
                    );
                }

                  const response = await service.SignUp({ email, password, phone });

                  if (response) {
                        // console.log('response to come:',response)
                        res.cookie('authToken', response.data.token, { 
                              httpOnly: true, 
                              secure: process.env.NODE_ENV === 'production',
                              sameSite: 'strict' 
                          }).status(201).json({ created_details: response.data.details });
                          
                  } else {
                    throw new APIError(
                      'Signup Error',
                      STATUS_CODES.BAD_REQUEST,
                      'Unable to sign up customer',
                      true
                  );
                  }
            } catch (error) {
              console.error('Error in /customer/signup:', error);
              next(error); 
            }
      })

/**
   * @swagger
   * /customer/login:
   *   post:
   *     summary: Login a customer
   *     description: Authenticates a customer and returns a token.
   *     tags:
   *       - Customers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Incorrect password or User does not exist
   */
            app.post("/customer/login", async (req:Request, res:Response, next:NextFunction) => {
                  try {
                    const { email, password } = req.body;
              
                    const response  = await service.SignIn({ email, password });
              
                   if(response && response.data){
                        res.cookie('authToken', response.data.token, { 
                              httpOnly: true, 
                              secure: process.env.NODE_ENV === 'production',
                              sameSite: 'strict' 
                          })
                            .status(200)
                            .json({customer_details:response.data.details})
                   }else {
                        res.status(400).json({ message: 'Incorrect password | User does not exist' });
                  }
                  } catch (err) {
                        console.error('Error in /customer/login:', err);
                       //pass the error to the ErrorHandler middleware
                        next(err)
                  }
                });

           
          
  /**
   * @swagger
   * /customer/address:
   *   post:
   *     summary: Add a new address
   *     description: Adds a new address to the customer's profile.
   *     tags:
   *       - Customers
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               street:
   *                 type: string
   *               postalCode:
   *                 type: string
   *               city:
   *                 type: string
   *               country:
   *                 type: string
   *     responses:
   *       200:
   *         description: Address added successfully
   *       400:
   *         description: Address could not be added
   */
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
                  res.status(400).json({ message: 'Address creation unsuccessful' });
              }
            } catch (err) {
              next(err);
            }
          });

/**
 * @swagger
 * /customer/profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the authenticated customer's profile information.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: Profile not available
 */

            app.get("/customer/profile", userAuth, async (req, res, next) => {
                  try {
                    const { _id } = req.user as payloadType;
                    const response = await service.GetProfile( _id );
                    if (response && response.data) {
                      res.status(200).json({ customer_details: response.data });
                    } else {
                      // Handle the case where the profile doesn't exist
                      next(new AppError('User profile not found', 404, 'Profile not available',true));
                    }
                  } catch (err) {
                    next(err);
                  }
                });

                
/**
 * @swagger
 * /customer/shopping-details:
 *   get:
 *     summary: Get shopping details
 *     description: Fetches the authenticated customer's profile information which in turns has shopping details.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: shopping details retrieved successfully
 *       400:
 *         description: Profile not available
 */
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

/**
 * @swagger
 * /customer/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     description: Fetches the authenticated customer's profile information.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: wishlist retrieved successfully
 *       400:
 *         description: Profile not available
 */
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