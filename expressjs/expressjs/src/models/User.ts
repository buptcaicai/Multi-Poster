import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

enum UserRole {
   ADMIN = 'admin',
   USER = 'user'
}
export class User {
   public _id!: string;

   @prop()
   public name!: string;

   @prop()
   public email!: string;

   @prop()
   public password!: string;

   @prop({ enum: UserRole , type: String, required: true})
   public roles!: [UserRole];

   @prop()
   public createdAt!: Date;

   @prop()
   public updatedAt!: Date;

   public static async initDB(this: ReturnModelType<typeof User>): Promise<void> {
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
         const hash = await bcrypt.hash('123456', saltRounds);
         this.create({ name: 'user1', email: 'user1@mail.com', password: hash, roles: 'user' });
      }
   }

   public static async getAllUsers(this: ReturnModelType<typeof User>): Promise<User[]> {
      const posts = await this.find()
      return posts;
   }

   public static async getUserById(this: ReturnModelType<typeof User>, id: string): Promise<User | null> {
      const user = await this.findById(id);
      return user;
   }

   public static async authenticateByNameAndPassword(this: ReturnModelType<typeof User>, name: string, password: string) {  
      const user =  await this.findOne({ name});
      if (!user) return null;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;
      return user;
   }
}

export const UserModel = getModelForClass(User, {
   schemaOptions: { timestamps: true, versionKey: false }
});


