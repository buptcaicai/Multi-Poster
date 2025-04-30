import Post from "./Post"
export default function PostList() {
    return <ul className="grid grid-cols-3 justify-center gap-4">    
        <li><Post author='MAXIMILIAN' body="React.js is awesome!"/></li>
        <li><Post author='MANUEL' body="Check out the full course!"/></li>
    </ul>
}