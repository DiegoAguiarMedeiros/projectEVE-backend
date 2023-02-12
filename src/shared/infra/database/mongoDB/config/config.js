import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_URL } = process.env;

const MONGO_DB_URL = MONGO_URL
  ? MONGO_URL
  : `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}`;

const initDB = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(MONGO_DB_URL);
  const { connection } = mongoose;

  connection.on('connected', () => {
    console.info('Mongoose conectado.');
  });

  connection.on('error', (err) => {
    console.error(`Mongoose com error ${err}`);
  });

  connection.on('disconnected', () => {
    console.info('Mongoose desconectado');
  });
};

export default initDB;
