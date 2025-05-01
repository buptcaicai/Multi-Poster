import { MdPostAdd, MdMessage } from 'react-icons/md';

export default function MainHeader({setShowCreateNew}: {setShowCreateNew: (show: boolean) => void}) {
   return <header className='flex place-content-between border-b-white border-b-2 mb-4 p-10  '>
            <h1 className='flex gap-x-2 text-gray-200 text-6xl'>
                  <MdMessage />
                  React Poster
            </h1>
            <p>
               <button onClick={() => {setShowCreateNew(true)}}
               className='flex gap-x-2 rounded-2xl bg-purple-300 text-black text-4xl p-4 font-medium hover:cursor-pointer'>
                  <MdPostAdd size={'2.75rem'} />
                  New Post
               </button>
            </p>
         </header>
}