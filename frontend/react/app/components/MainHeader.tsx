import { MdLogout, MdMessage } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { logout } from '~/apis/login';

export default function MainHeader() {
      const navigate = useNavigate();
   return <header className='flex place-content-between border-b-white border-b-2 mb-4 p-10 items-center'>
            <h1 className='flex gap-x-2 text-gray-200 text-6xl'>
                  <MdMessage />
                  React Poster
            </h1>
            <button className='flex gap-x-2 text-gray-200 text-4xl hover:cursor-pointer'
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}>
                  <MdLogout />
                  Logout
            </button>
         </header>
}