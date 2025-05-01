import Post from "./Post"
import NewPost from "./NewPost"
import { useState } from "react"
import Modal from "./Modal";

export default function PostList({showCreateNew, setShowCreateNew} : {showCreateNew: boolean, setShowCreateNew: (b: boolean) => void}) {
   console.log('showCreateNew', showCreateNew)

   const [posts, setPosts] = useState<{post: string, name: string}[]>([]);
   return <div>
      <Modal width="w-[30rem]" height="h-[30rem]" isVisible={showCreateNew} setVisible={setShowCreateNew}>
         <NewPost setModalOpen={setShowCreateNew} onSubmit={(post:string, name:string) => setPosts((oldPosts) => [{post, name}, ...oldPosts])}/>
      </Modal>
      <div>
         <ul className="grid grid-cols-3 justify-center gap-4">
            {posts.map((p, idx) =>(<li key={idx}><Post author={p.name} body={p.post} /></li>))}
         </ul>
      </div>
   </div>
}