import {UserDocument, UserModel, UserProps} from "../models";
import axios from "axios";


export class UserService {
    private static instance?: UserService;

    public static getInstance(): UserService {
        if(UserService.instance === undefined) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private constructor() { }

    async getAll(restaurant_id: string | null): Promise<UserDocument[]> {
        const filter: Record<string, any> = {};

        if (restaurant_id) {
            filter.restaurant = restaurant_id;
        }

        return UserModel.find(filter).populate("restaurant").populate("type").exec();
    }

    async getOneById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).populate("restaurant").populate("type").exec();
    }

    async getOneByLogin(login: string): Promise<UserDocument[]> {
        return UserModel.find({login : login}).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async verifyAddress(address: string): Promise<boolean> {
        return await axios.get('https://api-adresse.data.gouv.fr/search/?q=' + address)
            .then((response) => {
                return response.data.features.length !== 0;
            })
            .catch((error) => {
                throw new Error(error)
            })
    }

    async updateById(id: string, props: UserProps): Promise<UserDocument | null> {
        const user = await this.getOneById(id);
        if(!user) {
            return null;
        }

        if(props.login !== undefined) {
            user.login = props.login;
        }
        if(props.password !== undefined) {
            user.password = props.password;
        }
        if(props.lat !== undefined) {
            user.lat = props.lat
        }
        if(props.long !== undefined) {
            user.long = props.long
        }
        if(props.address !== undefined) {
            const exist = await this.verifyAddress(props.address);

            if(!exist) {
                throw new Error("wrong address")
            }
            user.address = props.address;
        }

        return await user.save();
    }
}