import {Request, RequestHandler} from "express";
import { OrderService } from "../services";

export function ownedOrder(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const order = await OrderService.getInstance().getOneById(req.params.id);

            if ((req.body.user.type._id === 4) && order?.client && order?.client._id.toString() !== req.body.user._id.toString()) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}