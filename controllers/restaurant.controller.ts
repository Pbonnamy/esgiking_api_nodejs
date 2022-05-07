import express, {Router, Request, Response} from "express";
import {RestaurantService} from "../services";
import {checkAuth} from "../middlewares";

export class RestaurantController {

    async createRestaurant(req: Request, res: Response) {
        const body = req.body;

        if(!body.name || !body.address || !body.phone) {
            res.status(400).end();
            return;
        }

        try {
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
                res.status(404).end();
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
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().updateById(req.params.id, req.body);

            if(!restaurant) {
                res.status(404).end();
                return;
            }

            res.json(restaurant);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use(checkAuth());
        router.post('/', express.json(), this.createRestaurant.bind(this));
        router.get('/', this.getAllRestaurants.bind(this));
        router.get('/:id', this.getOneRestaurant.bind(this));
        router.delete('/:id', this.deleteRestaurant.bind(this));
        router.put('/:id', express.json(), this.updateRestaurant.bind(this));
        return router;
    }
}