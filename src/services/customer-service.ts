import { ObjectId } from "mongoose";
import { CustomerRepository } from "../database/index";
import { Customer } from "../database/models/Customer";
import { GenerateSalt,GeneratePassword,GenerateSignature, FormatData, ValidatePassword } from "../utils";
import { Product } from "../database/models/Product";

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

            // Throw a custom error to be handled in the controller
            throw new Error('Signup failed. Please try again later.');
            }
      }

      // ------------------------------------------------------------------------
      async SignIn(userInputs:{email:string;password:string}){

            const { email, password } = userInputs;
            
            try {
                
                const existingCustomer = await this.repository.FindCustomer({ email}) as Customer;
    
                if(existingCustomer){
                
                    const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                    
                    if(validPassword){
                        const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id as ObjectId });
                        // console.log('signature generated while login:',token)
                        return FormatData({details: existingCustomer, token });
                    } 
                }else{
                      return FormatData(null);
                }
        
    
            } catch (err) {
                  console.error('SignIn Error:', err);
                  throw new Error("Error during sign-in process");
            }
    
        }
// -----------------------------------------------------------------------------------
 //To add new address
 async AddNewAddress(_id:ObjectId,userInputs:addressInputTypes){
        
      try {
          const addressResult = await this.repository.CreateAddress(_id,userInputs)
          return FormatData(addressResult);
          
      } catch (err) {
            console.error('AddnewAddress Error:', err);
            throw new Error("Error during adding address process");
      }
      
  
  }
  
  //---------------------------------------------------------------------------
  async GetProfile(id:ObjectId){

      try {
          const existingCustomer = await this.repository.FindCustomerById({id});
          return FormatData(existingCustomer);
          
      } catch (err) {
            console.error('GetProfile Error:', err);
            throw new Error("Error during getting profile process");
      }
  }

//------------------------------------------------------------------------
//------------------------------------------------------------------------
async GetShoppingDetails(id:ObjectId){

      try {
          const existingCustomer = await this.repository.FindCustomerById({id});
  
          if(existingCustomer){
             return FormatData(existingCustomer);
          }  else{
                return FormatData({ message: 'Error to get shopping details'});
          }     
          
      } catch (err) {
          
      }
  }        
  //-------------------------------------------------------------------------
  async GetWishList(customerId:ObjectId){

      try {
          const wishListItems = await this.repository.Wishlist(customerId);
          return FormatData(wishListItems);
      } catch (err) {
      //     throw new APIError('Data Not found', err)           
      }
  }
  //--------------------------------------------------------------------------

  async AddToWishlist(customerId:ObjectId, product:Product){
      try {
          const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
         return FormatData(wishlistResult);
  
      } catch (err) {
      //     throw new APIError('Data Not found', err)
      }
  }
//-----------------------------------------------------------------------------  

async ManageCart(customerId:ObjectId, product:Product, qty:number, isRemove:boolean){
      try {
          const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
          return FormatData(cartResult);
      } catch (err) {
      //     throw new APIError('Data Not found', err)
      }
  }



}
export default CustomerService