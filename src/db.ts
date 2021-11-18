import { MongoClient, Db } from 'mongodb';
import { QuestionModel } from './models/QuestionModel';
import { UserModel } from './models/UserModel';

const aClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
let mongoConnection: { db: Db; client: MongoClient } | undefined = undefined;

export const mc = async () => {
  if (mongoConnection) {
    return Promise.resolve(mongoConnection);
  }
  if (!process.env.MONGO_URL) {
    throw new Error('Please provide database url in your environment settings');
  }
  const client = await aClient.connect();
  const db = client.db();
  db.collection<UserModel>('User').createIndex({ username: 1 }, { unique: true });
  db.collection<QuestionModel>('Question').createIndex({ content: 'text', title: 'text' });
  mongoConnection = {
    client,
    db,
  };
  return mongoConnection;
};
