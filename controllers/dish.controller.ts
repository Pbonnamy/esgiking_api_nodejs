import express, {Router, Request, Response} from "express";
import {DishService, RestaurantService} from "../services";
import {checkAuth, checkUserType} from "../middlewares";

export class DishController {

    async createDish(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            const body = req.body;
            const error: Record<string, any> = {};

            if(!body.name) {
                error.name = "missing parameter"
            }
            if(!body.price) {
                error.price = "missing parameter"
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            const dish = await DishService.getInstance().createOne({
                name: body.name,
                price: body.price,
                restaurant: restaurant
            });

            res.json(dish);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllDishes(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            const dishes = await DishService.getInstance().getAll(req.params.restaurant);
            res.json(dishes);
        } catch(err) {
            res.status(500).end();
        }
    }

    async deleteDish(req: Request, res: Response) {
        try {
            const success = await DishService.getInstance().deleteById(req.params.id);
            
            if(success) {
                res.status(200).send({message : "Dish successfully deleted"}).end();
            } else {
                res.status(404).send({error : "Dish not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateDish(req: Request, res: Response) {
        try {
            const dish = await DishService.getInstance().updateById(req.params.id, req.body);

            if(!dish) {
                res.status(404).send({error : "Dish not found"}).end();
                return;
            }

            res.json(dish);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/restaurants/:restaurant/dishes', [checkAuth(), checkUserType([1, 2])], express.json(), this.createDish.bind(this));
        router.get('/restaurants/:restaurant/dishes', this.getAllDishes.bind(this));
        router.delete('/dishes/:id', [checkAuth(), checkUserType([1, 2])], this.deleteDish.bind(this));
        router.put('/dishes/:id', [checkAuth(), checkUserType([1, 2])], express.json(), this.updateDish.bind(this));
        return router;
    }
}