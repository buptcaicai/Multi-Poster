'use client';
import { useState } from "react";
import NewPost from "./NewPost";
import { MdPostAdd } from "react-icons/md";
import { Post } from "./Post";

export default function PostsPage() {
   const [newPostOpen, setNewPostOpen] = useState(false);
   const posts: Array<{name: string, text: string}> = [];
   console.log("posts", posts);

   return (
      <div>
         <NewPost open={newPostOpen} setOpen={setNewPostOpen} onSubmit={function (): void {
            throw new Error("Function not implemented.");
         } } />
         {/* <NewPost open={newPostOpen} setOpen={setNewPostOpen} onSubmit={revalidator.revalidate} /> */}
         <div>
            <p>
               <button
                  onClick={() => {
                     setNewPostOpen(true);
                  }}
                  className="flex gap-2 rounded-2xl bg-purple-300 
                     text-black text-1xl p-1 pl-2 pr-2 font-bold hover:cursor-pointer"
               >
                  <MdPostAdd size={"1.5rem"} />
                  New Post
               </button>
            </p>
            <ul className="grid grid-cols-3 justify-center gap-4 mt-6">
               {posts.map((p, idx) => (
                  <li key={idx}>
                     <Post author={p.name} body={p.text} />
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
}
