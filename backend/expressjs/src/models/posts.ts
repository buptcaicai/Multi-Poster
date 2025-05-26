import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Post {
   @Field(() => ID)
   @prop()
   public _id!: string;

   @Field()
   @prop()
   public text!: string;

   @Field()
   @prop()
   public name!: string;

   @Field()
   @prop()
   public createdAt!: Date;

   @Field()
   @prop()
   public updatedAt!: Date;

   public static async initDB(this: ReturnModelType<typeof Post>) {
      console.log('Initializing Post DB...');
      const onePost = await this.findOne();
      if (!onePost) {
         try {
            await Promise.all([
               this.create({text: "Text1", name: "User1"}),
               this.create({text: "Text2", name: "User2"}),
               this.create({text: "Text3", name: "User3"})
            ]);
         } catch (e) {
            console.error('Error initializing Post DB:', e);
         }
      }
   }

   public static async getAllPosts(this: ReturnModelType<typeof Post>): Promise<Post[]> {
      const posts = await this.find()
      return posts;
   }
}

export const PostModel = getModelForClass(Post, {
   schemaOptions: { timestamps: true, versionKey: false }
});
 

