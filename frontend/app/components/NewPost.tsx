import { useContext, useState } from "react";
import Modal from "./Modal";
import classes from "./NewPost.module.css"
import { createNewOpenContext } from "./Index";

export default function NewPost({onSubmit}: {onSubmit: (post: string, name:string) => void}) {
   const [newPost, setPost] = useState('');
   const [newName, setName] = useState('');
   const {open, setOpen} = useContext(createNewOpenContext);

   const buttonStyle = "bg-purple-950 text-white p-3 m-2 font-bold hover:bg-transparent hover:cursor-pointer";

   return  <Modal width="w-[30rem]" height="h-[30rem]" isVisible={open} setVisible={setOpen}>
            <form className="bg-purple-700 rounded-2xl w-[100%] h-[100%] p-3" 
                     onSubmit={(e) => {e.preventDefault(); 
                                       onSubmit(newPost, newName);
                                       setOpen(false);}}>
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
                  <button type="button" className={`${buttonStyle}`} onClick={() => setOpen(false)}>Cancel</button>
               </p>
            </form>
         </Modal>
}
