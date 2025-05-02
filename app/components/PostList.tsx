import Post from "./Post"
import NewPost from "./NewPost"
import { useState } from "react"
import Modal from "./Modal";

export default function PostList() {
   const [posts, setPosts] = useState<{post: string, name: string}[]>([]);
   return <div>
            <NewPost onSubmit={(post:string, name:string) => setPosts((oldPosts) => [{post, name}, ...oldPosts])}/>
            <div>
               <ul className="grid grid-cols-3 justify-center gap-4">
                  {posts.map((p, idx) =>(<li key={idx}><Post author={p.name} body={p.post} /></li>))}
               </ul>
            </div>
         </div>
}