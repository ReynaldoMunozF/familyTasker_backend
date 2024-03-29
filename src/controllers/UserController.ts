import { Controller } from "./Controller";
import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../database/data-source";

// -----------------------------------------------------------------------------

export class UserController implements Controller {
  async getAll(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      let { page, skip } = req.query;

      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 5;

      const [allUsers, count] = await userRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,

        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          birthday: true,
          roles_id:true,
          created_at: true,
          
        },
      });
      res.status(200).json({
         count,
          skip: itemsPerPage,
          page: currentPage,
          results: allUsers,

      });
    } catch (error) {
      res.status(500).json({
        message: "Error while getting users",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userId = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: {
          userDetails: true,  
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          birthday: true,
          roles_id:true,
          userDetails: {
            id: true,
            users_id: true,
            height: true,
            weight: true,
            shirt_size: true,
            pant_size: true,
            shoe_size: true,
            allergies: true,
          },
        }


      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting user",
      });
    }
  }

  async create(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const data = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const newUser = await userRepository.save(data);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({
        message: "Error while creating user",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update({ id: id }, data);

      res.status(202).json({
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while updating user",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete(id);

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while deleting user",
      });
    }
  }
}
