import express, {Router, Request, Response} from "express";
import {checkAuth, checkUserType} from "../middlewares";
import {RestaurantService, UserService} from "../services";

export class UserController {

    async getOneUser(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().getOneById(req.params.id);
            if(!user) {
                res.status(404).send({error : "User not found"}).end();
                return;
            }
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            const users = await UserService.getInstance().getAll(req.params.restaurant);
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
        router.get('/', this.getAllUsers.bind(this));
        router.get('/:id', this.getOneUser.bind(this));
        router.delete('/:id', [checkAuth(), checkUserType([1, 2])], this.deleteUser.bind(this));
        router.put('/:id', [checkAuth(), checkUserType([1, 2])], express.json(), this.updateUser.bind(this));
        return router;
    }
}