import * as fs from 'fs'
import * as path from 'path'
import sequelize from '../config/config';
import * as Sequelize from 'sequelize'

function toCamelCase(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const _ = str.indexOf("_");
  if (~_) {
    return toCamelCase(str.substring(0, _)
      + str.substring(_ + 1)
        .substring(0, 1)
        .toUpperCase()
      + str.substring(_ + 2)
    )
  }
  else {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }
}

let models: any = {};
let modelsLoaded = false;

const createModels = () => {
  if (modelsLoaded) return models;

  fs.readdirSync(path.resolve(__dirname, "./"))
    .filter((t) => (~t.indexOf('.ts') || ~t.indexOf('.js')) && !~t.indexOf("index") && !~t.indexOf(".map"))
    .map((model) => {
      const modelImport = require(path.join(__dirname, model));
      return modelImport.default
        ? new modelImport.default(sequelize, Sequelize.DataTypes)
        : new modelImport(sequelize, Sequelize.DataTypes);
    });

  Object.keys(sequelize.models).forEach((modelsListName) => {
    const modelName = toCamelCase(modelsListName);
    models[modelName] = sequelize.models[modelsListName];
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models['sequelize'] = sequelize;
  models['Sequelize'] = Sequelize;

  modelsLoaded = true;

  return models;
}

export default createModels();

sequelize.sync({ alter: true });


export {
  createModels
}