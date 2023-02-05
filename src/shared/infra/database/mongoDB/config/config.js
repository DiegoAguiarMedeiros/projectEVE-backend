import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_URL } = process.env;

const MONGO_DB_URL = MONGO_URL
  ? MONGO_URL
  : `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}`;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const initDB = async () => {
  mongoose.connect(MONGO_DB_URL, mongooseOptions);

  const { connection } = mongoose;

  connection.on('connected', () => {
    logger.info('Mongoose conectado.');
  });

  connection.on('error', (err) => {
    logger.error(`Mongoose com error ${err}`);
  });

  connection.on('disconnected', () => {
    logger.info('Mongoose desconectado');
  });
};

export default initDB;
