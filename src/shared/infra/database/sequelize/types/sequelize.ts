import { Model, Sequelize, ModelStatic } from 'sequelize';

export interface IAssociableModel extends Model {
    associate?: (models: Record<string, ModelStatic<IAssociableModel>>) => void;
}

export type IAssociableModelStatic<T extends IAssociableModel> = ModelStatic<T> & {
    associate?: (models: Record<string, ModelStatic<IAssociableModel>>) => void;
};
