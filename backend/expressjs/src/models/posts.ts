import * as fs from "fs/promises";
import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const PostFileName = require('path').resolve('./src/data/posts.json')

const postSchema = {
   type: "object",
   properties: {
      text: {type: "string"},
      name: {type: "string"}
   },
   required: ["text", "name"],
   additionalProperties: false
}

const validate = ajv.compile(postSchema);

export class Post {
   text: string
   name: string

   constructor(text:string, name:string) {
      this.text = text
      this.name = name
   }
   
   static isValidJson(post: string) {
      return validate(post)
   }

   static async fetchAll() {
      const posts:Array<Post> = JSON.parse(await fs.readFile(PostFileName, {encoding: "utf-8"}))
      return posts
   }

   async save() {
      const posts:Array<Post> = JSON.parse(await fs.readFile(PostFileName, {encoding: "utf-8"}))
      posts.push(this)
      await fs.writeFile(PostFileName, JSON.stringify(posts), {encoding: "utf-8", flag: "w+"});
   }
}
