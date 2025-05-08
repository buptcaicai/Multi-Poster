import { MdMessage } from "react-icons/md";
import { useFetcher } from "react-router";
import classes from "./Form.module.css"

export default function LoginForm() {
   const fetcher = useFetcher();
   return <div className="h-screen flex flex-col items-center justify-center">
      <h1 className='flex gap-x-2 text-gray-200 text-6xl w-[100%] justify-center'>
            <MdMessage />
            React Poster
      </h1>
      <div className="w-[100%] justify-center flex mt-9">
         <fetcher.Form className="w-[70%] h-[70%] p-3 max-w-150" method="post">
            <p>
               <label className={classes.label}>Username</label>
               <input className={classes.input} type="text" name="username" required />
            </p>
            <p>
               <label className={classes.label}>Password</label>
               <input className={classes.input}type="password" name="password" required />
            </p>
            <button type="submit" className="flex ml-auto mr-3 bg-purple-950 text-white text-2xl 
            p-3 m-2 font-bold hover:bg-transparent hover:cursor-pointer rounded-2xl">Login</button>
         </fetcher.Form>
      </div>
   </div>
}
