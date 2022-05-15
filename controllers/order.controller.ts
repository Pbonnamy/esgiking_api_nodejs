import express, {Router, Request, Response} from "express";
import {OrderService, UserService} from "../services";
import {checkAuth, checkOrder, checkUserType, existRestaurant, ownedRestaurant} from "../middlewares";
import {AuthUtil} from "../utils";

const jwt = require('jsonwebtoken')

export class OrderController {

    async createOrder(req: Request, res: Response) {
        try {
            const body = req.body;

            const order = await OrderService.getInstance().createOne({
                dishes: body.dishes,
                client: body.user,
                restaurant : body.restaurant,
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
        router.use(express.json())
        router.post('/:restaurant/orders', [checkAuth(),existRestaurant("restaurant"), checkUserType([4]), checkOrder()], this.createOrder.bind(this));
        router.get('/:restaurant/orders', [checkAuth(), existRestaurant("restaurant"), ownedRestaurant("restaurant"), checkUserType([1, 2, 3])], this.getAllOrders.bind(this));
        router.get('/:restaurant/orders/:id', [checkAuth(), existRestaurant("restaurant")], this.getOneOrder.bind(this));
        router.delete('/:restaurant/orders/:id', [checkAuth(), existRestaurant("restaurant")], this.deleteOrder.bind(this));
        router.put('/:restaurant/orders/:id', [checkAuth(), existRestaurant("restaurant"), checkOrder()], this.updateOrder.bind(this));
        return router;
    }
}