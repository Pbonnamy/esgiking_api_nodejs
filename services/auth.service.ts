import {UserDocument, UserModel, UserProps} from "../models";
import {AuthUtil} from "../utils";
import {UserService} from "./user.service";

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

    public async register(props: Partial<UserProps>): Promise<UserDocument> {
        if(!props.password) {
            throw new Error('Missing parameters');
        }

        if (props.address) {
            const exist = await UserService.getInstance().verifyAddress(props.address)

            if(!exist) {
                throw new Error("address error")
            }

            props.long = exist.geometry.coordinates[0];
            props.lat = exist.geometry.coordinates[1];
        }

        const model = new UserModel({
            login: props.login,
            password: AuthUtil.sha512(props.password),
            type: props.type,
            restaurant: props.restaurant,
            address: props.address,
            long: props.long,
            lat: props.lat
        });

        const user = await model.save();
        await user.populate("type");
        await user.populate("restaurant");

        return user;
    }

    public async logIn(props: Partial<UserProps>): Promise<string> {
        if(!props.password) {
            throw new Error('Missing parameters');
        }

        const user = await UserModel.findOne({
            login: props.login,
            password: AuthUtil.sha512(props.password)
        }).exec();

        if (!user) {
            throw new Error('User not found');
        }

        return jwt.sign({
            id: user.id,
            username: user.login,
            type: user.type
        }, process.env.SECRET, {expiresIn: '1d'})
    }

    public me(token: string | undefined): string {
        const extracted = AuthUtil.getToken(token)

        const content = jwt.decode(extracted, {complete: false})
        content.iat = new Date(content.iat * 1000).toISOString();
        content.exp = new Date(content.exp * 1000).toISOString();

        return content;
    }
}
