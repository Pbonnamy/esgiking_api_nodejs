import express, {Request, Response, Router} from "express";
import {AuthService, RestaurantService} from "../services";
import {checkAuth, checkRegisterType} from "../middlewares";

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const body = req.body;

            if (body.restaurant) {
                const restaurant = await RestaurantService.getInstance().getOneById(body.restaurant);
                if(!restaurant) {
                    res.status(404).send({error : "Restaurant not found"}).end();
                    return;
                }
            }

            const user = await AuthService.getInstance().register({
                login: body.login,
                password: body.password,
                type: body.type,
                restaurant: body.restaurant
            });

            user.password = undefined
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async logIn(req: Request, res: Response) {
        try {
            const token = await AuthService.getInstance().logIn({
                login: req.body.login,
                password: req.body.password
            });

            res.json({
                access_token: token
            });
        } catch(err) {
            res.status(401).send({ error: 'Invalid credentials' }).end();
        }
    }

    async me(req: Request, res: Response) {
        try {
            const decoded = AuthService.getInstance().me(req.headers.authorization);

            res.json(decoded);
        } catch(err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/register', express.json(), checkRegisterType(), this.register.bind(this));
        router.post('/login', express.json(), this.logIn.bind(this));
        router.get('/me', checkAuth(), this.me.bind(this));
        return router;
    }
}