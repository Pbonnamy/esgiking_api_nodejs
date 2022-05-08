import express, {Router, Request, Response} from "express";
import {RestaurantService} from "../services";
import {checkAuth, checkUserType} from "../middlewares";

export class RestaurantController {

    async createRestaurant(req: Request, res: Response) {
        try {
            const body = req.body;

            const error: Record<string, any> = {};

            if(!body.name) {
                error.name = "missing parameter"
            }
            if(!body.address) {
                error.address = "missing parameter"
            }
            if(!body.phone) {
                error.phone = "missing parameter"
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            const restaurant = await RestaurantService.getInstance().createOne({
                name: body.name,
                address: body.address,
                phone: body.phone,
                description: body.description,
            });

            res.json(restaurant);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllRestaurants(req: Request, res: Response) {
        try {
            const restaurants = await RestaurantService.getInstance().getAll();
            res.json(restaurants);
        } catch(err) {
            res.status(500).end();
        }
    }

    async getOneRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.id);
            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }
            res.json(restaurant);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteRestaurant(req: Request, res: Response) {
        try {
            const success = await RestaurantService.getInstance().deleteById(req.params.id);
            if(success) {
                res.status(200).send({message : "Restaurant successfully deleted"}).end();
            } else {
                res.status(404).send({error : "Restaurant not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().updateById(req.params.id, req.body);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            res.json(restaurant);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/', [checkAuth(), checkUserType([1])], express.json(), this.createRestaurant.bind(this));
        router.get('/', this.getAllRestaurants.bind(this));
        router.get('/:id', this.getOneRestaurant.bind(this));
        router.delete('/:id', [checkAuth(), checkUserType([1])], this.deleteRestaurant.bind(this));
        router.put('/:id', [checkAuth(), checkUserType([1, 2])], express.json(), this.updateRestaurant.bind(this));
        return router;
    }
}