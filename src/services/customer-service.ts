import { CustomerRepository } from "../database/index";
import { GenerateSalt,GeneratePassword,GenerateSignature, FormatData } from "../utils";

interface userInputsType{
      email:string;
      password:string;
      phone:string;
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
                  
            }
      }
}
export default CustomerService