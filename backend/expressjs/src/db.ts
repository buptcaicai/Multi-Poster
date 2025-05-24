import mongoose from 'mongoose';
import { createClient } from 'redis';
import { User } from './models/users';
import { Post } from './models/posts';

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
   await Promise.all([User.initDB(), Post.initDB()]);
   await redisClient.connect();
   redisClient.on('error', err => console.log('Redis Client Error', err));
}

export async function closeDB() {
   await mongoose.disconnect();
   await redisClient.destroy();
}
