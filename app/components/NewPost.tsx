import { useState } from "react";
import classes from "./NewPost.module.css"

export default function NewPost({setModalOpen, onSubmit}: {setModalOpen: (b: boolean) => void, onSubmit: (post: string, name:string) => void}) {
   const [newPost, setPost] = useState('');
   const [newName, setName] = useState('');

   const buttonStyle = "bg-purple-950 text-white p-3 m-2 font-bold hover:bg-transparent hover:cursor-pointer";

   return <form className="bg-purple-700 rounded-2xl w-[100%] h-[100%] p-3" 
                onSubmit={(e) => {e.preventDefault(); 
                                  onSubmit(newPost, newName);
                                  setModalOpen(false);}}>
      <p>
         <label className={classes.label} htmlFor="body">Text</label>
         <textarea className={classes.input} id= "body" required rows={3} maxLength={200} onChange={(e) => {setPost(e.target.value)}}/>
      </p>
      <p>
         <label className={classes.label} htmlFor="name">Your Name</label>
         <input className={classes.input} type="text" id="name" required maxLength={50} onChange={(e) => {setName(e.target.value)}}/>
      </p>
      <p className="flex gap-3">
         <button type="submit" className={`${buttonStyle} ml-auto`}>Submit</button>
         <button type="button" className={`${buttonStyle}`} onClick={() => setModalOpen(false)}>Cancel</button>
      </p>
   </form>
}
