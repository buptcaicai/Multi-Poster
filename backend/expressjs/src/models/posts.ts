import { Schema, model, Model, Types } from 'mongoose';
import Ajv from "ajv"
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const PostFileName = require('path').resolve('./src/data/posts.json')

const postAjvSchema = {
   type: "object",
   properties: {
      text: {type: "string"},
      name: {type: "string"}
   },
   required: ["text", "name"],
   additionalProperties: false
}

const validate = ajv.compile(postAjvSchema);

interface IPost {
   _id: Types.ObjectId;
   text: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}

interface PostModel extends Model<IPost> {
   initDB(): Promise<IPost>;
   getAllPosts(): Promise<IPost[]>;
}

const postSchema = new Schema({
   text: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   }
}, {
   timestamps: true,
   versionKey: false,
});

postSchema.statics.isValidJson = function(post: string) {
   return validate(post);
}

postSchema.statics.initDB = async function() {
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

postSchema.statics.getAllPosts = async function() {
   const posts = await this.find()
   return posts;
}

export const Post = model<IPost, PostModel>('Post', postSchema);