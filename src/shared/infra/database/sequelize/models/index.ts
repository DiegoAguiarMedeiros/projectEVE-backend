import fs from 'fs';
import path from 'path';
import { Sequelize, ModelStatic, DataTypes } from 'sequelize';
import sequelize from '../config/config.js';  // Importa a configuração da conexão
import { IAssociableModel, IAssociableModelStatic } from '../types/sequelize';

const models: Record<string, IAssociableModelStatic<IAssociableModel>> = {};
let modelsLoaded = false;

const createModels = (): Record<string, IAssociableModelStatic<IAssociableModel>> => {
  if (modelsLoaded) return models;

  // Carrega todos os arquivos de modelo
  const modelFiles = fs
    .readdirSync(path.resolve(__dirname))
    .filter(
      (file) =>
        (file.endsWith('.ts') || file.endsWith('.js')) &&
        !file.includes('index') &&
        !file.endsWith('.map')
    );

  modelFiles.forEach((file) => {
    const modelImport = require(path.join(__dirname, file));
    const model = modelImport.default
      ? modelImport.default(sequelize, DataTypes)
      : modelImport(sequelize, DataTypes);

    const modelName = model.name;
    models[modelName] = model as IAssociableModelStatic<IAssociableModel>;
  });

  // Configura as associações entre os modelos
  Object.keys(models).forEach((modelName) => {
    const model = models[modelName];
    if (model.associate) {
      model.associate(models);  // Define as associações
    }
  });

  modelsLoaded = true;
  return models;
};

export default createModels();
export { createModels };
