import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";


export class RestaurantService {
    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if(RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    private constructor() { }

    public async createOne(props: RestaurantProps): Promise<RestaurantDocument> {
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