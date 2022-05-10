import express, {Router, Request, Response} from "express";
import {MenuService} from "../services/menu.service";

export class MenuController {
    async createMenu(req: Request, res: Response) {
        const body = req.body;

        const error: Record<string, any> = {};

        if(!body.name) {
            error.name = "missing parameter"
        }
        if(!body.price) {
            error.price = "missing parameter"
        }
        if(!body.dishes) {
            error.dishes = "missing parameter"
        }

        if (Object.keys(error).length !== 0) {
            res.status(400).send(error).end();
            return;
        }

        try {
            const menu = await MenuService.getInstance().createOne({
                name: body.name,
                price: body.price,
                dishes: body.dishes,
            });

            res.json(menu);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllMenus(req: Request, res: Response) {
        try {
            const menus = await MenuService.getInstance().getAll();
            res.json(menus);
        } catch(err) {
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
                res.status(404).send({error : "menu not found"}).end();
                return;
            }

            res.json(menu);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use(checkAuth());
        router.post('/', express.json(), this.createMenu.bind(this));
        router.get('/', this.getAllMenus.bind(this));
        router.get('/:id', this.getOneMenu.bind(this));
        router.delete('/:id', this.deleteMenu.bind(this));
        router.put('/:id', express.json(), this.updateMenu.bind(this));
        return router;
    }
}