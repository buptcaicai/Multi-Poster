import NewPost from "./NewPost"
import { MdPostAdd } from "react-icons/md"
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Post } from "./Post";

const GET_POSTS = gql`
   query Post {
    posts {
        _id,
        name,
        text
    }
}`;

type TPost = {
   _id: string;
   name: string;
   text: string;
}

type Response = {
   posts: TPost[];
}

export default function PostList() {
   const [newPostOpen, setNewPostOpen] = useState(false);
   const { data, refetch } = useQuery<Response>(GET_POSTS);
   const posts = data?.posts || [];

   return <div>
      <NewPost open={newPostOpen} setOpen={setNewPostOpen} onSubmit={refetch} />
      <div>
         <p>
            <button onClick={() => { setNewPostOpen(true) }} className='flex gap-2 rounded-2xl bg-purple-300 
                     text-black text-1xl p-1 pl-2 pr-2 font-bold hover:cursor-pointer'>
               <MdPostAdd size={'1.5rem'} />
               New Post
            </button>
         </p>
         <ul className="grid grid-cols-3 justify-center gap-4 mt-6">
            {posts.map((p) => (<li key={p._id}><Post author={p.name} body={p.text} /></li>))}
         </ul>
      </div>
   </div>
}