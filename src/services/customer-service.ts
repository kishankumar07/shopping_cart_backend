import { ObjectId } from "mongoose";
import { CustomerRepository } from "../database/index";
import { Customer } from "../database/models/Customer";
import { GenerateSalt,GeneratePassword,GenerateSignature, FormatData, ValidatePassword } from "../utils";
import { Product } from "../database/models/Product";
import { APIError,AppError,STATUS_CODES } from "../utils/app-errors";

interface userInputsType{
      email:string;
      password:string;
      phone:string;
}
export interface addressInputTypes{
      street:string;
      postalCode:string;
      city:string;
      country:string
}

class CustomerService{
      private repository : CustomerRepository

      constructor(){
            this.repository = new CustomerRepository
      }
      async SignUp(userInputs:userInputsType){
            const {email,password,phone} = userInputs;
            try {
                  let salt = await GenerateSalt();
                  let userPassword = await GeneratePassword(password,salt);
                  const existingCustomer = await this.repository.CreateCustomer({email,password:userPassword,phone,salt});

                  const token = await GenerateSignature({email:email,_id:existingCustomer.id});

                  return FormatData({details:existingCustomer,token});
            } catch (error) {
                   
                console.error('Error during SignUp in CustomerService:', error);
                // Throw APIError to propagate to the route
                throw new APIError(
                    'Sign Up Error',
                    STATUS_CODES.BAD_REQUEST,
                    'Signup failed. Please try again later.',
                    true
                );
            }
      }

      // ------------------------------------------------------------------------
      async SignIn(userInputs:{email:string;password:string}){

            const { email, password } = userInputs;
            
            try {
                
                const existingCustomer = await this.repository.FindCustomer({ email}) as Customer;
    
                if (!existingCustomer) {
                    throw new AppError(
                      "Sign In Error",
                      STATUS_CODES.NOT_FOUND,
                      "User does not exist",
                      true
                    );
                  }
            
                  const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
            
                  if (!validPassword) {
                    throw new AppError(
                      "Sign In Error",
                      STATUS_CODES.UN_AUTHORIZED,
                      "Incorrect password",
                      true
                    );
                  }
            
                  const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id as ObjectId });
                  return FormatData({ details: existingCustomer, token });
    
            } catch (err) {
                console.error("SignIn Error:", err);
                throw new AppError(
                  "Sign In Error",
                  STATUS_CODES.INTERNAL_ERROR,
                  "An error occurred during sign-in",
                  true
                );
            }
    
        }
// -----------------------------------------------------------------------------------
 //To add new address
 async AddNewAddress(_id:ObjectId,userInputs:addressInputTypes){
        
      try {
          const addressResult = await this.repository.CreateAddress(_id,userInputs)
          return FormatData(addressResult);
          
      } catch (err) {
        console.error('AddNewAddress Error:', err);
        throw new AppError(
          'Add Address Error',
          500,
          'Error while adding the new address. Please try again later.',
          true
        );
      }
      
  
  }
  
  //---------------------------------------------------------------------------
  async GetProfile(id:ObjectId){

      try {
          const existingCustomer = await this.repository.FindCustomerById({id});
          if (!existingCustomer) {
            throw new AppError('User profile not found', 404, 'The requested profile is not available',true);
          }
          return FormatData(existingCustomer);
          
      } catch (err) {
        console.error('GetProfile Error:', err);
        throw new AppError('Error during profile retrieval', 500, 'Unable to fetch profile',true);
      }
      }
  

//------------------------------------------------------------------------
//------------------------------------------------------------------------
async GetShoppingDetails(id:ObjectId){

      try {
          const existingCustomer = await this.repository.FindCustomerById({id});
  
          if (existingCustomer) {
            return FormatData(existingCustomer);
        } else {
            throw new AppError(
                'Customer not found',
                404,
                'Unable to retrieve shopping details for the provided customer ID',
                true
            );
        }   
          
      } catch (err) {
        console.error('Error in GetShoppingDetails:', err);
        // Wrap and throw a new AppError to handle this error at a higher level
        throw new AppError(
            'Failed to retrieve shopping details',
            500,
            'An error occurred while fetching shopping details',
            true
        );
      }
  }        
  //-------------------------------------------------------------------------
  async GetWishList(customerId:ObjectId){

      try {
          const wishListItems = await this.repository.Wishlist(customerId);
          if (wishListItems && wishListItems.length > 0) {
            return FormatData(wishListItems);
          } else {
            throw new AppError(
                'No items found in wishlist',
                404,
                'The customer has no items in their wishlist',
                true
            );
        }
      } catch (err) {
        console.error('Error in GetWishList:', err);
        throw new AppError(
            'Failed to retrieve wishlist',
            500,
            'An error occurred while fetching wishlist details',
            true
        );        
      }
  }
  //--------------------------------------------------------------------------

  async AddToWishlist(customerId:ObjectId, product:Product){
      try {
          const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
         return FormatData(wishlistResult);
  
      } catch (err) {
        console.error('Error in AddToWishlist service:', err);
        throw new AppError('Error adding to wishlist', 500, 'Unable to process the wishlist request', true);
      }
  }
//-----------------------------------------------------------------------------  

async ManageCart(customerId:ObjectId, product:Product, qty:number, isRemove:boolean){
      try {
          const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
          return FormatData(cartResult);
      } catch (err) {
        console.error('Error managing cart:', err);
        throw new AppError('Error processing cart update', 500, 'Operation failed', true);
    }
  }



}
export default CustomerService