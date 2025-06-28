"use client";
import { use, useEffect, useState } from "react";
import NewPost from "./NewPost";
import { MdPostAdd } from "react-icons/md";
import { Post } from "./Post";
import { getAllPosts } from "@/actions/postActions";
import { useUserInfo } from "@/contexts/UserInfoContext";

export default function PostsPage() {
   const { userInfo, setUserInfo } = useUserInfo();
   const [newPostOpen, setNewPostOpen] = useState(false);
   const [posts, setPosts] = useState<Array<{ name: string; text: string }> | undefined>(undefined);

   const syncPosts = async () => {
      const posts = await getAllPosts();
      console.log("posts", posts);
      setPosts(posts);
   };

   useEffect(() => {
      syncPosts();
   }, []);

   if (posts == null) {
      return <div>Loading...</div>;
   }

   console.log("userInfo in posts page", userInfo);
   return (
      <div>
         <NewPost open={newPostOpen} setOpen={setNewPostOpen} onSubmit={syncPosts} />
         <div>
            <p>
               <button
                  onClick={() => setNewPostOpen(true)}
                  className="flex gap-2 rounded-2xl bg-purple-300 text-black text-1xl p-1 pl-2 pr-2 font-bold hover:cursor-pointer">
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
