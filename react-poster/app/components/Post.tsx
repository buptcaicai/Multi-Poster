import classes from "./Post.module.css"
export default function Post({author, body}: {author:string, body:string}) {
   return <div className={classes.container}>
            <p className={classes.author}>{author}</p>
            <p className={classes.body}>{body}</p>
         </div>
}
