import mongoose from "mongoose";
import { createClient } from "redis";
import { UserModel } from "@/models/User";
import { PostModel } from "@/models/Post";

export const redisClient = createClient({
   username: "default",
   password: process.env.REDIS_PASSWORD,
   socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
   },
});

export async function initDB() {
   console.log("Connecting to MongoDB and Redis...");
   await mongoose.connect(process.env.MONGO_DB_URI as string);
   await Promise.all([UserModel.initDB(), PostModel.initDB()]);
   await redisClient.connect();
   redisClient.on("error", (err) => console.log("Redis Client Error", err));
}

export async function closeDB() {
   await mongoose.disconnect();
   await redisClient.destroy();
}
