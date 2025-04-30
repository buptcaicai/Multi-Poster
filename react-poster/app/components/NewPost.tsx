export default function NewPost() {
   return <form className="bg-purple-500 rounded-2xl w-[70%]">
      <p>
         <label htmlFor="body">Text</label>
         <textarea id= "body" required rows={3} />
      </p>
      <p>
         <label htmlFor="name">Your Name</label>
         <input type="text" id="name" required />
      </p>
   </form>
}