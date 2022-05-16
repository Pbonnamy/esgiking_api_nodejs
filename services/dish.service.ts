import {DishDocument, DishModel, DishProps} from "../models";

export class DishService {
    private static instance?: DishService;

    public static getInstance(): DishService {
        if(DishService.instance === undefined) {
            DishService.instance = new DishService();
        }
        return DishService.instance;
    }

    private constructor() { }

    public async createOne(props: Partial<DishProps>): Promise<DishDocument> {
        const model = new DishModel(props);
        return await model.save();
    }

    async getAll(restaurant_id: string): Promise<DishDocument[]> {
        return DishModel.find({restaurant: restaurant_id}).exec();
    }

    async getOneById(id: string): Promise<DishDocument | null> {
        return DishModel.findById(id).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await DishModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async updateById(id: string, props: DishProps): Promise<DishDocument | null> {
        const dish = await this.getOneById(id);
        if(!dish) {
            return null;
        }

        if(props.name !== undefined) {
            dish.name = props.name;
        }
        if(props.price !== undefined) {
            dish.price = props.price;
        }

        return await dish.save();
    }

    async verifyDishes(body: any) {
        const res: Record<string, any> = {};
        const dishes = [];

        if (!Array.isArray(body.dishes)) {
            res.error = "wrong parameter";
        } else {
            res.error = {};

            for (const id of body.dishes) {
                const dish = await DishService.getInstance().getOneById(id);
                if (!dish) {
                    res.error[id] = "not found";
                } else {
                    dishes.push(dish);
                }
            }

            if (Object.keys(res.error).length === 0) {
                delete res.error
            }

            if (dishes.length !== 0) {
                res.dishes = dishes;
            }
        }

        return res;
    }
}