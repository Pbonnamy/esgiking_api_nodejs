import {MenuDocument, MenuModel, MenuProps} from "../models/menu.model";


export class MenuService {
    private static instance?: MenuService;

    public static getInstance(): MenuService {
        if(MenuService.instance === undefined) {
            MenuService.instance = new MenuService();
        }
        return MenuService.instance;
    }

    private constructor() { }

    public async createOne(props: MenuProps): Promise<MenuDocument> {
        const model = new MenuModel(props);
        return await model.save();
    }

    async getAll(): Promise<MenuDocument[]> {
        return MenuModel.find().exec();
    }

    async getOneById(id: string): Promise<MenuDocument | null> {
        return MenuModel.findById(id).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await MenuModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async updateById(id: string, props: MenuProps): Promise<MenuDocument | null> {
        const menu = await this.getOneById(id);
        if(!menu) {
            return null;
        }

        if(props.name !== undefined) {
            menu.name = props.name;
        }
        if(props.price !== undefined) {
            menu.price = props.price;
        }
        if(props.dishes!== undefined) {
            menu.dishes = props.dishes;
        }

        return await menu.save();
    }
}