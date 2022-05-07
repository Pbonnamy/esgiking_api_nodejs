import express, {Request, Response, Router} from "express";
import {AuthService} from "../services";
import {checkAuth} from "../middlewares";

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};

            if(!body.login) {
                error.login = "missing parameter"
            }
            if(!body.password) {
                error.password = "missing parameter"
            }
            if(!body.type) {
                error.type = "missing parameter"
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            const user = await AuthService.getInstance().register({
                login: body.login,
                password: body.password,
                type: body.type
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
        router.post('/register', express.json(), this.register.bind(this));
        router.post('/login', express.json(), this.logIn.bind(this));
        router.get('/me', checkAuth(), this.me.bind(this));
        return router;
    }
}