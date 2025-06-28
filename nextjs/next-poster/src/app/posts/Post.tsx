import classes from "./Post.module.css"

export function Post({author, body}: {author:string, body:string}) {
   return (
      <div className="rounded-2xl bg-gray-200 p-4 w-[30rem] wrap-break-word max-h-60 overflow-auto w-auto">
         <p className="text-[1.25rem] font-bold text-purple-800">{author}</p>
         <p className="text-2xl italic font-medium">{body}</p>
      </div>
   );
}
