"use client";
import { getAllUsers, TUser } from "@/actions/userActions";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";

export default function UserList() {
   const [users, setUsers] = useState<Array<TUser>>([]); // TODO: remove this

   const syncUsers = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      setUsers(users);
   };

   useEffect(() => {
      syncUsers();
   }, []);

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
                  <TableRow key={user.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
