import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
   

   const roles = req.tokenData.role;

   if (!roles.includes("admin")) {
      return res.status(StatusCodes.FORBIDDEN).json({
         message: "You are not allowed to access this resource",
      });
   }

   next();
};