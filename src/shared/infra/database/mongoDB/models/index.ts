import { UserModel } from './User';
import { EnvelopeModel } from './Envelope';
import { DepositModel } from './Deposit';
import { WithdrawalModel } from './Withdrawal';

const models: any = {
  'userModel': UserModel,
  'depositModel': DepositModel,
  'withdrawalModel': WithdrawalModel,
  'envelopeModel': EnvelopeModel
  ,
};

const createModels = () => {
  return models;
}

export default createModels();

export {
  createModels
}