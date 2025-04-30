import Post from "./Post"
import NewPost from "./NewPost"
export default function PostList() {
   return <>
      <NewPost />
      <ul className="grid grid-cols-3 justify-center gap-4">
         <li><Post author='MAXIMILIAN' body="React.js is awesome!" /></li>
         <li><Post author='MANUEL' body="Check out the full course!" /></li>
      </ul>
   </>
}