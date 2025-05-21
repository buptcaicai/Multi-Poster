import mongoose from 'mongoose';
import { User } from './models/users';

export default function init() {
   mongoose.connect(process.env.MONGO_DB_URI as string).then(() => {
      User.initDB().catch((err) => {
         console.error('Error initializing admin user:', err);
      });
   }).catch((err) => {
      console.error('MongoDB connection error:', err);
   });
}