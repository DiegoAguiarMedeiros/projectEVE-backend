import mongoose, { Schema, Document } from 'mongoose';
import MONGO_DB_URL from '../config/config';


(async function createHooksForAggregateRoots() {

    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_DB_URL);
    const { connection } = mongoose;

    connection.on('connected', () => {
        console.info('Mongoose conectado.');
    });

    connection.on('error', (err) => {
        console.info(`Mongoose com error ${err}`);
    });

    connection.on('disconnected', () => {
        console.info('Mongoose desconectado');
    });

})();
