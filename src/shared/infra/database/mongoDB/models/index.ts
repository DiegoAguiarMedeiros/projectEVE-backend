import UserModel from './User';

const models: any = {
  'userModel': UserModel
};

const createModels = () => {
  return models;
}

export default createModels();

export {
  createModels
}