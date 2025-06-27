import { useState } from "react";
import Modal from "./Modal";

const labelStyle = "block text-gray-300 p-1 m-1 font-bold text-3xl justify-center rounded-2xl";
const inputStyle = "bg-amber-500 p-1 justify-center border-purple-200 rounded-2xl w-[100%] text-purple-950 text-2xl";

export default function NewPost({open, setOpen, onSubmit}: {open: boolean, setOpen: (b:boolean) => void, onSubmit: () => void}) {
   const [newPost, setPost] = useState('');
   const [newName, setName] = useState('');

   const buttonStyle = "bg-purple-950 text-white p-3 m-2 font-bold hover:bg-transparent hover:cursor-pointer";

   return  <Modal width="w-[30rem]" height="h-[30rem]" isVisible={open} setVisible={setOpen}>
            <form className="bg-purple-700 rounded-2xl w-[100%] h-[100%] p-3" >
                     {/* onSubmit={async (e) => {e.preventDefault(); await addPost(newPost, newName); setOpen(false); onSubmit();}}> */}
               <p>
                  <label className={labelStyle}>Text</label>
                  <textarea className={inputStyle} required rows={3} maxLength={200} onChange={(e) => {setPost(e.target.value)}}/>
               </p>
               <p>
                  <label className={labelStyle}>Your Name</label>
                  <input className={inputStyle} type="text" required maxLength={50} onChange={(e) => {setName(e.target.value)}}/>
               </p>
               <p className="flex gap-3">
                  <button type="submit" className={`${buttonStyle} ml-auto`}>Submit</button>
                  <button type="button" className={`${buttonStyle}`} onClick={() => setOpen(false)}>Cancel</button>
               </p>
            </form>
         </Modal>
}
