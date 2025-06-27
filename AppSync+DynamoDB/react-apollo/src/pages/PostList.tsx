import NewPost from "./NewPost"
import { MdPostAdd } from "react-icons/md"
import { useContext, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Post } from "./Post";
import { Navigate } from "react-router-dom";
import { AuthContext } from "~/contexts/UserRoleContext";

const GET_POSTS = gql`
   query Post {
    posts {
        _id,
        name,
        text
    }
}`;

type Response = {
   posts: {
      _id: string;
      name: string;
      text: string;
   }[];
};

export default function PostList() {
   const setUser = useContext(AuthContext)?.setUser;
   const [newPostOpen, setNewPostOpen] = useState(false);
   const { loading, data, error, refetch } = useQuery<Response>(GET_POSTS);
   const posts = data?.posts || [];

   let content;
   if (error) {
      if ('UNAUTHENTICATED' === (error?.cause?.extensions as { code?: string })?.code) {
         setUser && setUser(undefined);
         console.log('redirecting 2 to /login');
         return <Navigate to="/login" replace />
      }
      content = <p className="text-red-500">Error loading posts: {error.message}</p>;
   } else {
      if (loading) {
         return <p>Loading...</p>;
      }
      content = <ul className="grid grid-cols-3 justify-center gap-4 mt-6">
         {posts.map((p) => (<li key={p._id}><Post author={p.name} body={p.text} /></li>))}
      </ul>;
   }
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
         {content}
      </div>
   </div>
}
