import {MenuDocument, MenuModel, MenuProps} from "../models";


export class MenuService {
    private static instance?: MenuService;

    public static getInstance(): MenuService {
        if(MenuService.instance === undefined) {
            MenuService.instance = new MenuService();
        }
        return MenuService.instance;
    }

    private constructor() { }

    public async createOne(props: Partial<MenuProps>): Promise<MenuDocument> {
        const model = new MenuModel(props);
        return await model.save();
    }

    async getAll(restaurant_id: string): Promise<MenuDocument[]> {
        return MenuModel.find({restaurant: restaurant_id}).populate("dishes").exec();
    }

    async getOneById(id: string): Promise<MenuDocument | null> {
        return MenuModel.findById(id).populate("dishes").exec();
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
        if(props.discount!== undefined) {
            menu.discount = props.discount;
        }

        return await menu.save();
    }

    async verifyMenus(body: any) {
        const res: Record<string, any> = {};
        const menus = [];

        if (!Array.isArray(body.menus)) {
            res.error = "wrong parameter";
        } else {
            res.error = {};

            for (const id of body.menus) {
                const menu = await MenuService.getInstance().getOneById(id);
                if (!menu) {
                    res.error[id] = "not found";
                } else {
                    menus.push(menu);
                }
            }

            if (Object.keys(res.error).length === 0) {
                delete res.error
            }

            if (menus.length !== 0) {
                res.menus = menus;
            }
        }

        return res;
    }
}