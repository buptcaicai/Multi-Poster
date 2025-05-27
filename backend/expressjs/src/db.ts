import mongoose from 'mongoose';
import { createClient } from 'redis';
import { UserModel } from './models/User';
import { PostModel } from './models/Post';

export const redisClient = createClient({
   username: 'default',
   password: 'PAceRdylHMlksAxKzvP6hYfNHN1DGIKe',
   socket: {
      host: 'redis-11988.c257.us-east-1-3.ec2.redns.redis-cloud.com',
      port: 11988
   }
});

export async function initDB() {
   console.log('Connecting to MongoDB and Redis...');
   await mongoose.connect(process.env.MONGO_DB_URI as string);
   await Promise.all([UserModel.initDB(), PostModel.initDB()]);
   await redisClient.connect();
   redisClient.on('error', err => console.log('Redis Client Error', err));
}

export async function closeDB() {
   await mongoose.disconnect();
   await redisClient.destroy();
}
