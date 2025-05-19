import { Schema, model, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

type IRole = 'admin' | 'user';

interface IUser {
   _id: Types.ObjectId;
   name: string;
   email: string;
   password: string;
   role: IRole[];
}

interface UserModel extends Model<IUser> {
  initAdmin(): Promise<IUser>;
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
   role: [{
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
   }],
   }, {
   timestamps: true,
   versionKey: false,
});

userSchema.statics.findByEmail = async function(email: string) {
   const user = await this.findOne({ email });
   if (!user) {
      throw new Error('User not found');
   }
   return user;
}

userSchema.statics.findById = async function(id: string) {
   const user = await this.findOne({ _id: id });
   if (!user) {
      throw new Error('User not found');
   }
   return user;
}

userSchema.statics.authenticateByNameAndPassword = async function(name: string, password: string) {  
   const user =  await this.findOne({ name});
   if (!user) return null;
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return null;
   return user;
}

userSchema.statics.createUser = async function(name: string, email: string, password: string) {
   const user = await this.create({ name, email, password });
   return user;
}

userSchema.statics.initAdmin = async function() {
   const name = process.env.ADMIN_USERNAME;

   const existingAdmin = await this.findOne({ role: 'admin', name });
   if (existingAdmin != null) return existingAdmin;
   
   const password = process.env.ADMIN_PASSWORD;
   const email = process.env.ADMIN_EMAIL;
   const hash = await bcrypt.hash(password as string, saltRounds);
   const user = await this.create({ name, email, password: hash, role: 'admin' });
   return user;
}

export const User = model<IUser, UserModel>('User', userSchema);