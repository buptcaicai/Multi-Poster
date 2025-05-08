import { Post } from "./Post"
import type { PostType } from "./Post"
import NewPost from "./NewPost"
import { MdPostAdd } from "react-icons/md"
import { useState } from "react";

export default function PostList({posts}: {posts: Array<PostType>}) {
   const [newPostOpen, setNewPostOpen] = useState(false);
   return <div>
            <NewPost onSubmit={(post: string, name: string) => { console.log(`new post`, { post, name }); } } 
                     open={newPostOpen} setOpen={setNewPostOpen} />
            <div>
               <p>
                  <button onClick={() => {setNewPostOpen(true)}} className='flex gap-2 rounded-2xl bg-purple-300 
                     text-black text-1xl p-1 pl-2 pr-2 font-bold hover:cursor-pointer'>
                     <MdPostAdd size={'1.5rem'} />
                     New Post
                  </button>
               </p>
               <ul className="grid grid-cols-3 justify-center gap-4 mt-6">
                  {posts.map((p, idx) =>(<li key={idx}><Post author={p.name} body={p.text} /></li>))}
               </ul>
            </div>
         </div>
}