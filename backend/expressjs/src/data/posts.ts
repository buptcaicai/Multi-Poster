import * as fs from "fs/promises";
import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const PostFileName = require('path').resolve('./src/data/posts.json')

interface Post {
   text:string,
   name:string
}

const postSchema = JSONSchemaType<Post> = {
   type: "object",
   properties: {
      text: {type: "string"},
      name: {type: "string"}
   },
   required: ["text", "name"],
   additionalProperties: false
}

const validate = ajv.compile(postSchema);

export async function getStoredPosts() {
   const posts:Array<Post> = JSON.parse(await fs.readFile(PostFileName, {encoding: "utf-8"}))
   return posts
}

export async function addPost(post: Post) {
   if (!validate(post)) {
      throw new Error(`post is invalid: ${validate.errors}`)
   }
   const posts:Array<Post> = JSON.parse(await fs.readFile(PostFileName, {encoding: "utf-8"}))
   posts.push(post)
   await fs.writeFile(PostFileName, JSON.stringify(posts), {encoding: "utf-8", flag: "w+"});
}
