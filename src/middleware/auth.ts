import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, decode } from "jsonwebtoken";
import { UserTokenData } from "../types/types";

// -----------------------------------------------------------------------------

export const auth = (req: Request, res: Response, next: NextFunction) => {
   req.headers;
   
   const token = req.headers.authorization?.split(" ")[1];
   
   
   if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: "Unauthorized - falta el token",
      });
   }

   try {
      
      const decoded = jwt.verify(token, "123") as JwtPayload;

      console.log(decoded);
      

     

      next();
   } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
         message: "Unauthorized - soy del catch",
      });
   }
};