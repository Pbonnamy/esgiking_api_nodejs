import express, {Router, Request, Response} from "express";
import {OrderService, RestaurantService} from "../services";

export class OrderController {

    async createOrder(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            const body = req.body;
            const error: Record<string, any> = {};

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            const order = await OrderService.getInstance().createOne({
            });

            res.json(order);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getOneOrder(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance().getOneById(req.params.id);
            if(!order) {
                res.status(404).send({error : "Order not found"}).end();
                return;
            }
            res.json(order);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            }

            const orders = await OrderService.getInstance().getAll(req.params.restaurant);
            res.json(orders);
        } catch(err) {
            res.status(500).end();
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const success = await OrderService.getInstance().deleteById(req.params.id);

            if(success) {
                res.status(200).send({message : "Order successfully deleted"}).end();
            } else {
                res.status(404).send({error : "Order not found"}).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance().updateById(req.params.id, req.body);

            if(!order) {
                res.status(404).send({error : "Order not found"}).end();
                return;
            }

            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/:restaurant/orders', express.json(), this.createOrder.bind(this));
        router.get('/:restaurant/orders', this.getAllOrders.bind(this));
        router.get('/:restaurant/orders/:id', this.getOneOrder.bind(this));
        router.delete('/:restaurant/orders/:id', this.deleteOrder.bind(this));
        router.put('/:restaurant/orders/:id', express.json(), this.updateOrder.bind(this));
        return router;
    }
}