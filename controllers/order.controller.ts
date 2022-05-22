import express, {Router, Request, Response} from "express";
import {OrderService} from "../services";
import {checkAuth, checkOrder, checkUserType, existRestaurant, ownedOrder, ownedRestaurant} from "../middlewares";

export class OrderController {

    async createOrder(req: Request, res: Response) {
        try {
            const body = req.body;

            let props = {
                dishes: body.dishes,
                menus: body.menus,
                take_away: body.take_away,
                restaurant : body.restaurant,
                client: undefined
            }

            if (body.take_away === true) {
                props.client = body.user
            }

            const order = await OrderService.getInstance().createOne(props);

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
            let orders;

            const filter: Record<string, any> = {};

            filter.restaurant = req.params.restaurant;

            if (req.body.user.type._id === 4) {
                filter.client = req.body.user._id;
            }

            orders = await OrderService.getInstance().getAll(filter);

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

    async createMessage(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance().getOneById(req.params.id);

            if(!order) {
                res.status(404).send({error : "Order not found"}).end();
                return;
            }

            const body = req.body;
            const error: Record<string, any> = {};

            if(!body.text) {
                error.text = "missing parameter"
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }
            const message = await OrderService.getInstance().createMessage({
                text: body.text,
                date: new Date(),
                sender: body.user
            }, order._id.toString());

            res.json(message);
        } catch(err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(express.json())
        router.post('/:restaurant/orders', [existRestaurant("restaurant"), checkOrder(true)], this.createOrder.bind(this));
        router.get('/:restaurant/orders', [existRestaurant("restaurant"), checkAuth(), checkUserType([1, 2, 3]), ownedRestaurant("restaurant")],this.getAllOrders.bind(this));
        router.get('/:restaurant/orders/:id', [existRestaurant("restaurant"), checkAuth(), ownedOrder()], this.getOneOrder.bind(this));
        router.delete('/:restaurant/orders/:id',[existRestaurant("restaurant"),checkAuth(), checkUserType([1, 2, 3, 4]), ownedOrder()], this.deleteOrder.bind(this));
        router.put('/:restaurant/orders/:id', [existRestaurant("restaurant"), ownedOrder(), checkOrder()], this.updateOrder.bind(this));
        router.post('/:restaurant/orders/:id/messages', [existRestaurant("restaurant"),checkAuth(), ownedOrder()], this.createMessage.bind(this));
        return router;
    }
}