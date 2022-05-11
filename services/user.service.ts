import {UserDocument, UserModel, UserProps} from "../models";


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

        return UserModel.find(filter).populate("restaurant").exec();
    }

    async getOneById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).populate("restaurant").exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
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

        return await user.save();
    }
}