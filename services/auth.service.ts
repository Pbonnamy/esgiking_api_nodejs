import {UserDocument, UserModel, UserProps} from "../models";
import {AuthUtils} from "../utils";

const jwt = require('jsonwebtoken')

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if(AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() { }

    public async register(user: Partial<UserProps>): Promise<UserDocument> {
        if(!user.password || !user.login) {
            throw new Error('Missing parameters');
        }

        const model = new UserModel({
            login: user.login,
            password: AuthUtils.sha512(user.password)
        });

        return model.save();
    }

    public async logIn(info: Pick<UserProps, 'login' | 'password'>): Promise<string> {
        const user = await UserModel.findOne({
            login: info.login,
            password: AuthUtils.sha512(info.password)
        }).exec();

        if (!user) {
            throw new Error('User not found');
        }

        return jwt.sign({
            id: user.id,
            username: user.login
        }, process.env.SECRET, {expiresIn: '1h'})
    }

    public me(token: string | undefined): string {
        const extracted = AuthUtils.getToken(token)

        return jwt.decode(extracted, {complete: false})
    }
}
