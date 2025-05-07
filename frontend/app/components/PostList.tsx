import { Post } from "./Post"
import type { PostType } from "./Post"
import NewPost from "./NewPost"

export default function PostList({posts}: {posts: Array<PostType>}) {
   return <div>
            <NewPost onSubmit={(post:string, name:string) => {console.log(`new post`, {post, name})}}/>
            <div>
               <ul className="grid grid-cols-3 justify-center gap-4">
                  {posts.map((p, idx) =>(<li key={idx}><Post author={p.name} body={p.text} /></li>))}
               </ul>
            </div>
         </div>
}