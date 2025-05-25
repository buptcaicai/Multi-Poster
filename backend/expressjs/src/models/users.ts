import { Schema, model, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

type IRole = 'admin' | 'user';

export interface IUser {
   _id: Types.ObjectId;
   name: string;
   email: string;
   password: string;
   roles: IRole[];
   createdAt: Date;
}

interface UserModel extends Model<IUser> {
   initDB(): Promise<IUser>;
   getAllUsers(): Promise<IUser[]>;
   getUserById(id: string): Promise<IUser | null>;
   authenticateByNameAndPassword(name: string, password: string): Promise<IUser>;
}

const saltRounds = 10;

const userSchema = new Schema<IUser, UserModel>({
   name: {
      type: String,
      unique: true,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   roles: [{
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
   }],
   }, {
   timestamps: true,
   versionKey: false,
});

userSchema.statics.createUser = async function(name: string, email: string, password: string) {
   const user = await this.create({ name, email, password });
   return user;
}

userSchema.statics.getAllUsers = async function() {
   const users = await this.find();
   return users;
}

userSchema.statics.getUserById = async function(id: string) {
   const user = await this.findById(id);
   return user;
}

userSchema.statics.authenticateByNameAndPassword = async function(name: string, password: string) {  
   const user =  await this.findOne({ name});
   if (!user) return null;
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return null;
   return user;
}

userSchema.statics.initDB = async function() {
   const name = process.env.ADMIN_USERNAME;
   const existingAdmin = await this.findOne({ roles: 'admin', name });
   if (existingAdmin == null) {
      const password = process.env.ADMIN_PASSWORD;
      const email = process.env.ADMIN_EMAIL;
      const hash = await bcrypt.hash(password as string, saltRounds);
      this.create({ name, email, password: hash, roles: 'admin' });
   }
   
   const user1 = await this.findOne({ roles: 'user', name: 'user1' });
   if (user1 == null) {
      this.create({ name:'user1', email:'user1@mail.com', password: '123456', roles: 'user' });
   }
}

export const User = model<IUser, UserModel>('User', userSchema);
