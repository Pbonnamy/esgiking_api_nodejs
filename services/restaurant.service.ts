import {RestaurantDocument, RestaurantModel, RestaurantProps, UserProps} from "../models";
import {UserService} from "./user.service";


export class RestaurantService {
    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if(RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    private constructor() { }

    public async createOne(props: Partial<RestaurantProps>): Promise<RestaurantDocument> {
        if (!props.address) {
            throw new Error("missing address")
        }

        const exist = await UserService.getInstance().verifyAddress(props.address)

        if(!exist) {
            throw new Error("address error")
        }
        props.long = exist.geometry.coordinates[0];
        props.lat = exist.geometry.coordinates[1];


        const model = new RestaurantModel(props);
        return await model.save();
    }

    async getAll(): Promise<RestaurantDocument[]> {
        return RestaurantModel.find().exec();
    }

    async getOneById(id: string): Promise<RestaurantDocument | null> {
        return RestaurantModel.findById(id).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await RestaurantModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async updateById(id: string, props: RestaurantProps): Promise<RestaurantDocument | null> {
        const restaurant = await this.getOneById(id);
        if(!restaurant) {
            return null;
        }

        if(props.name !== undefined) {
            restaurant.name = props.name;
        }
        if(props.address !== undefined) {
            restaurant.address = props.address;
            const exist = await UserService.getInstance().verifyAddress(props.address);

            if(!exist) {
                throw new Error("wrong address")
            }

            restaurant.long = exist.geometry.coordinates[0];
            restaurant.lat = exist.geometry.coordinates[1];
        }
        if(props.phone!== undefined) {
            restaurant.phone = props.phone;
        }
        if(props.description!== undefined) {
            restaurant.description = props.description;
        }

        return await restaurant.save();
    }
}