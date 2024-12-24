
import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_URL } = process.env;

const MONGO_DB_URL: string = MONGO_URL
  ? MONGO_URL
  : `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}`;



export default MONGO_DB_URL;