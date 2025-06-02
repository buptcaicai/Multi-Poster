import { useState } from "react";
import Modal from "~/component/Modal";
import classes from "./Form.module.css"
import { gql, useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";

const ADD_POSTS = gql`
   mutation Post ($text: String!, $name: String!) {
    addPost(text: $text, name: $name) {
        name,
        text
    }
}`;

export default function NewPost({open, setOpen, onSubmit}: {open: boolean, setOpen: (b:boolean) => void, onSubmit: () => void}) {
   const [newPost, setPost] = useState('');
   const [newName, setName] = useState('');
   const [addPost, {error}] = useMutation(ADD_POSTS);

   const buttonStyle = "bg-purple-950 text-white p-3 m-2 font-bold hover:bg-transparent hover:cursor-pointer";

   if (error) {
      console.error('Error adding post:', error);
      return <Navigate to="/login" replace />;
   }  

   return  <Modal width="w-[30rem]" height="h-[30rem]" isVisible={open} setVisible={setOpen}>
            <form className="bg-purple-700 rounded-2xl w-[100%] h-[100%] p-3" 
         onSubmit={async (e) => {
            e.preventDefault(); await addPost({ variables: { text: newPost, name: newName }}); setOpen(false); onSubmit();}}>
               <p>
                  <label className={classes.label}>Text</label>
                  <textarea className={classes.input} required rows={3} maxLength={200} onChange={(e) => {setPost(e.target.value)}}/>
               </p>
               <p>
                  <label className={classes.label}>Your Name</label>
                  <input className={classes.input} type="text" required maxLength={50} onChange={(e) => {setName(e.target.value)}}/>
               </p>
               <p className="flex gap-3">
                  <button type="submit" className={`${buttonStyle} ml-auto`}>Submit</button>
                  <button type="button" className={`${buttonStyle}`} onClick={() => setOpen(false)}>Cancel</button>
               </p>
            </form>
         </Modal>
}
