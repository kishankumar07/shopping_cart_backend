import { CustomerModel } from "../models/index";

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
}
export default CustomerRepository