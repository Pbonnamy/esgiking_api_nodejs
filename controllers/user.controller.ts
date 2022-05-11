import express, {Router, Request, Response} from "express";
import {checkAllUsers, checkAuth, checkUserType} from "../middlewares";
import { RestaurantDocument } from "../models";
import {RestaurantService, UserService} from "../services";
import {checkUser} from "../middlewares/user.middleware";

export class UserController {

    async getOneUser(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().getOneById(req.params.id);
            if (!user) {
                res.status(404).send({error: "User not found"}).end();
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(400).end();
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {

            let restaurant: RestaurantDocument | null = null;

            if (req.query.restaurant) {
                if (typeof req.query.restaurant !== 'string') {
                    res.status(400).end();
                    return;
                }
                restaurant = await RestaurantService.getInstance().getOneById(req.query.restaurant);

                if(!restaurant) {
                    res.status(404).send({error : "Restaurant not found"}).end();
                    return;
                }

            }

            const users = await UserService.getInstance().getAll(restaurant?.id);
            res.json(users);
        } catch(err) {
            res.status(500).end();
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const success = await UserService.getInstance().deleteById(req.params.id);

            if(success) {
                res.status(200).send({message : "User successfully deleted"}).end();
            } else {
                res.status(404).send({error : "User not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().updateById(req.params.id, req.body);

            if(!user) {
                res.status(404).send({error : "User not found"}).end();
                return;
            }

            res.json(user);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', [checkAuth(), checkUserType([1, 2]), checkAllUsers()], this.getAllUsers.bind(this));
        router.get('/:id', [checkAuth(), checkUser()], this.getOneUser.bind(this));
        router.delete('/:id', [checkAuth(), checkUserType([1, 2]), checkUser()], this.deleteUser.bind(this));
        router.put('/:id', [checkAuth(), checkUserType([1, 2, 4]), checkUser()], express.json(), this.updateUser.bind(this));
        return router;
    }
}