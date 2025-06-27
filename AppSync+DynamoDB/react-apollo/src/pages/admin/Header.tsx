import { useMutation, gql } from '@apollo/client';
import { useContext } from 'react';
import { MdLogout, MdMessage } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { AuthContext } from '~/contexts/UserRoleContext';

export default function Header() {
   const navigate = useNavigate();
   const [logout] = useMutation(gql`mutation { logout }`);
   const setUser = useContext(AuthContext)?.setUser;
   
   return <header className='flex place-content-between border-b-white border-b-2 mb-4 p-10 items-center'>
      <h1 className='flex gap-x-2 text-gray-200 text-6xl'>
         <MdMessage />
         React Poster
      </h1>
      <button className='flex gap-x-2 text-gray-200 text-4xl hover:cursor-pointer'
         onClick={() => {
            logout();
            setUser && setUser(undefined); // Clear user context
            navigate("/login");
         }}>
         <MdLogout />
         Logout
      </button>
   </header>
}
