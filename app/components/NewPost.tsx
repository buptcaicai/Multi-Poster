import { useState } from "react"
import classes from "./NewPost.module.css"
export default function NewPost({setPost, setName}: {setPost: (s:string) => void, setName:(s:string) => void}) {
   return <form className="bg-purple-700 rounded-2xl w-[100%] h-[100%] p-3">
      <p>
         <label className={classes.label} htmlFor="body">Text</label>
         <textarea className={classes.input} id= "body" required rows={3} maxLength={200} onChange={(e) => {setPost(e.target.value)}}/>
      </p>
      <p>
         <label className={classes.label} htmlFor="name">Your Name</label>
         <input className={classes.input} type="text" id="name" required maxLength={50} onChange={(e) => {setName(e.target.value)}}/>
      </p>
   </form>
}