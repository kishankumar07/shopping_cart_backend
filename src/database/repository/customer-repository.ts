import { ObjectId } from "mongoose";
import { addressInputTypes } from "../../services/customer-service";
import { Customer } from "../models/Customer";
import { AddressModel, CustomerModel } from "../models/index";
import { Product } from "../models/Product";
import { Types } from "mongoose";
import mongoose from "mongoose";



interface createCustomerType{
      email:string;password:string;phone:string;salt:string
}

class CustomerRepository {
      async CreateCustomer ({email,password,phone,salt}:createCustomerType){
            try {
                  const customer = new CustomerModel({email,password,salt,phone,address:[]});
                  const customerResult = await customer.save();
                  return customerResult;
            } catch (error) {
                  if (error instanceof Error) {
                        console.error('Error at CreateCustomer repo:', error.message);
                        throw new Error(error.message);
                  } else {
                        console.error('Unexpected error:', error);
                        throw new Error('An unknown error occurred');
                  }
            }
      }

      async FindCustomer({ email }:{email:string}) {
            try {
              const existingCustomer = await CustomerModel.findOne({ email: email });
              return existingCustomer;
            } catch (err) {
            
            }
          }

          async CreateAddress(_id:ObjectId,userInputs:addressInputTypes) {
            try {
                  const {street,postalCode,city,country} = userInputs;
              const profile = await CustomerModel.findById(_id) as Customer;
        
              if (profile) {
                const newAddress = new AddressModel({
                  street,
                  postalCode,
                  city,
                  country,
                });
        
                await newAddress.save();
        
                profile.address.push(newAddress._id);
              }
        
              return await profile.save();
            } catch (error) {
                  if (error instanceof Error) {
                        console.error('Error at createAddress repo:', error.message);
                        throw new Error(error.message);
                  } else {
                        console.error('Unexpected error:', error);
                        throw new Error('An unknown error occurred');
                  }
            }
          }

          async FindCustomerById({ id }:{id:ObjectId}) {
            try {
              const existingCustomer = await CustomerModel.findById(id)
                .populate("address")
                .populate("wishlist")
                .populate("orders")
                .populate("cart.product");
            //     console.log('this is the exisiting customer at FindCustomerById of customer-repository:',existingCustomer)
              return existingCustomer;
            } catch (error) {
                  if (error instanceof Error) {
                        throw new Error(error.message);
                  } else {
                        console.error('Unexpected error:', error);
                        throw new Error('An unknown error occurred');
                  }
              
            }
          }

          async Wishlist(customerId:ObjectId) {
            try {
              const profile = await CustomerModel.findById(customerId).populate(
                "wishlist"
              );
              return profile?.wishlist;
            } catch (err) {
            
            }
          }

          async AddWishlistItem(customerId:ObjectId, product:Product) {
            try {
              const profile = await CustomerModel.findById(customerId).populate(
                "wishlist"
              );
        
              if (profile) {
                let wishlist = profile.wishlist;
        
                if (wishlist.length > 0) {
                  let isExist = wishlist.some((item) => item._id.toString() === product._id.toString());
              
                  if (isExist) {
                      wishlist = wishlist.filter((item) => item._id.toString() !== product._id.toString());
                  } else {
                        wishlist.push(new Types.ObjectId(product._id.toString())); 
                  }
              } else {
                  wishlist.push(new Types.ObjectId(product._id.toString()));
              }
              
                profile.wishlist = wishlist;
              }else  {
                  throw new Error("Profile not found");
              }
        
              const profileResult = await profile.save();
        
              return profileResult.wishlist;
            } catch (err) {
            //   throw new APIError(
            //     "API Error",
            //     STATUS_CODES.INTERNAL_ERROR,
            //     "Unable to Add to WishList"
            //   );
            }
          }

          async AddCartItem(customerId:ObjectId, product:Product, qty:number, isRemove:boolean) {
            try {
              const profile = await CustomerModel.findById(customerId).populate("cart.product");
            //   console.log('this is the rpofi:',profile)
              if (!profile) {
                  throw new Error("Unable to add to cart!");
              }else{

                    const cartItem = {
                        product:new mongoose.Types.ObjectId(product._id.toString()), 
                      unit: qty,
                    };
            
                    let cartItems = profile.cart || [];
                
                    if (cartItems.length > 0) {
                      
                      let isExist = false;
                      cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                          if (isRemove) {
                            cartItems.splice(cartItems.indexOf(item), 1);
                          } else {
                            item.unit = qty;
                          }
                          isExist = true;
                        }
                      });
            
                      if (!isExist) {
                        cartItems.push(cartItem);
                  }
                } else {
                 
                  cartItems.push(cartItem);
                 
                    }
            
                    profile.cart = cartItems;
            
                    const cartSaveResult = await profile.save();
                    
            
                    return cartSaveResult.cart;
                  }
            
              
             
            } catch (err) {
             if(err instanceof Error){
                  console.error(err.message)
             }
            }
          }


}
export default CustomerRepository