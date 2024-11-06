import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../confg/index'
import { ObjectId } from 'mongoose';

interface payloadType{
      email:string;
      _id:ObjectId;
}

//utility functions

const GenerateSalt = async()=>{
      return await bcryptjs.genSalt();
}

const GeneratePassword = async(password:string,salt:string)=>{
      return await bcryptjs.hash(password,salt);
}

const GenerateSignature = async(payload:payloadType)=>{
      try {
            return await jwt.sign(payload,APP_SECRET!,{expiresIn:'30d'});
      } catch (error) {
            console.log(error);
            return error
      }
}

// const ValidatePassword = async(enteredPassword,savedPassword,salt)=>{
//       return await GeneratePassword(enteredPassword,salt) === savedPassword
// }

// const ValidateSignature = async (req) => {
//       try {
//         const signature = req.get('Authorization');
//         console.log('this is the signature at validateSignature:',signature)
//         // Check if the signature exists
//         if (!signature) {
//           console.log('Authorization header missing');
//           return false;
//         }
    
//         // Split the token and check if it's formatted properly
//         const token = signature.split(' ')[1];
//         if (!token) {
//           console.log('Token missing in Authorization header');
//           return false;
//         }
    
//         // Verify the token using the secret
//         const payload = await jwt.verify(token, APP_SECRET);
//         req.user = payload;
//         return true;
//       } catch (error) {
//         console.log('Error during token validation:', error);
//         return false;
//       }
//     };

    function FormatData<T>(data: T | null | undefined): { data: T } | null {
      if (data != null) { // checks for both null and undefined
           
            return { data };
      } else {
            console.warn('Data not found');
            return null; 
      }
}



export{GenerateSalt,GeneratePassword,GenerateSignature,FormatData}