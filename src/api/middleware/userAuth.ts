import { NextFunction, Request, Response } from "express";
import { ValidateSignature } from "../../utils"

export default async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
      try {
            const isAuthorized = await ValidateSignature(req);
            if (!isAuthorized) {
               res.status(403).json({ message: "Not authorized" });
               return;
            }
            next(); 
          } catch (error) {
            console.error("Error in authorization middleware:", error);
            res.status(500).json({ message: "Internal Server Error" });
          }
}