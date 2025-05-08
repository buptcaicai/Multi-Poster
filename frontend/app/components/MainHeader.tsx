import { MdPostAdd, MdMessage } from 'react-icons/md';

export default function MainHeader() {
   return <header className='flex place-content-between border-b-white border-b-2 mb-4 p-10  '>
            <h1 className='flex gap-x-2 text-gray-200 text-6xl'>
                  <MdMessage />
                  React Poster
            </h1>
         </header>
}