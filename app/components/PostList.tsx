import Post from "./Post"
import NewPost from "./NewPost"
import { useState } from "react"
import Modal from "./Modal";

export default function PostList() {
   let [newPost, setPost] = useState('');
   let [newName, setName] = useState('');
   return <div>
      <Modal width="w-[30rem]" height="h-[30rem]" isVisible={true}>
         <NewPost setName={setName} setPost={setPost}/>
      </Modal>
      <div>
         <ul className="grid grid-cols-3 justify-center gap-4">
            <li><Post author={newName} body={newPost} /></li>
            <li><Post author='MANUEL' body="Check out the full course!" /></li>
         </ul>
      </div>
   </div>
}