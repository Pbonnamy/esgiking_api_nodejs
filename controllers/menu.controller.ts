import express, {Router, Request, Response} from "express";
import { MenuService, RestaurantService } from "../services";
import {checkAuth, checkMenu, checkUserType, existRestaurant, ownedRestaurant} from "../middlewares";

export class MenuController {
    async createMenu(req: Request, res: Response) {
        const body = req.body;

        try {
            const menu = await MenuService.getInstance().createOne({
                name: body.name,
                price: body.price,
                restaurant: body.restaurant,
                dishes: body.dishes
            });

            res.json(menu);
        } catch(err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async getAllMenus(req: Request, res: Response) {
        try {
            const menus = await MenuService.getInstance().getAll(req.params.restaurant);
            res.json(menus);
        } catch(err) {
            console.log(err)
            res.status(500).end();
        }
    }


    async getOneMenu(req: Request, res: Response) {
        try {
            const menu = await MenuService.getInstance().getOneById(req.params.id);
            if(!menu) {
                res.status(404).send({error : "Menu not found"}).end();
                return;
            }
            res.json(menu);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteMenu(req: Request, res: Response) {
        try {
            const success = await MenuService.getInstance().deleteById(req.params.id);
            if(success) {
                res.status(200).send({message : "Menu successfully deleted"}).end();
            } else {
                res.status(404).send({error : "Menu not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateMenu(req: Request, res: Response) {
        try {
            const menu = await MenuService.getInstance().updateById(req.params.id, req.body);

            if(!menu) {
                res.status(404).send({error : "Menu not found"}).end();
                return;
            }

            res.json(menu);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json());
        router.post('/:restaurant/menus', [checkAuth(), checkUserType([1, 2]), existRestaurant("restaurant"), ownedRestaurant("restaurant"), checkMenu(true)], this.createMenu.bind(this));
        router.get('/:restaurant/menus',existRestaurant("restaurant"), this.getAllMenus.bind(this));
        router.get('/:restaurant/menus/:id', existRestaurant("restaurant"), this.getOneMenu.bind(this));
        router.delete('/:restaurant/menus/:id', [checkAuth(), checkUserType([1, 2]), existRestaurant("restaurant"), ownedRestaurant("restaurant")], this.deleteMenu.bind(this));
        router.put('/:restaurant/menus/:id', [checkAuth(), checkUserType([1, 2]), existRestaurant("restaurant"), ownedRestaurant("restaurant"), checkMenu()], this.updateMenu.bind(this));
        return router;
    }
}