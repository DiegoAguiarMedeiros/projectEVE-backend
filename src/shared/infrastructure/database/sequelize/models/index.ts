import * as fs from 'fs';
import * as path from 'path';
import sequelize from '../config/config';
import * as Sequelize from 'sequelize';

const models: { [key: string]: any } = {};

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      (file.endsWith('.ts') || file.endsWith('.js'))
  )
  .forEach((file) => {
    const modelImport = require(path.join(__dirname, file));
    const Model = modelImport.default || modelImport;
    models[Model.name] = Model;
  });

// Agora que todos os modelos foram carregados, inicialize as associações
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
