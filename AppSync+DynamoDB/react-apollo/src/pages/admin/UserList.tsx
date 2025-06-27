import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
   query Users {
      users {
         _id,
         name,
         email,
         roles,
         createdAt
      }
   }`;

type TUser = {
   _id: string;
   name: string;
   email: string;
   roles: string[];
   createdAt: Date;
}

type Response = {
   users: TUser[];
}
   

export default function UserList() {
   const { data, refetch } = useQuery<Response>(GET_USERS);
   const users = data?.users || [];

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Roles</TableCell>
                  <TableCell align="center">CreatedAt</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {users.map((user) => (
                  <TableRow
                     key={user._id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">
                        {user.name}
                     </TableCell>
                     <TableCell align="center">{user.email}</TableCell>
                     <TableCell align="center">{user.roles.join(",")}</TableCell>
                     <TableCell align="center">{user.createdAt.toString()}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}