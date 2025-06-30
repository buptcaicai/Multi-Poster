import { getAllUsers, type Users } from "~/apis/users";
import type { Route } from "../+types/root";
import { redirect } from "react-router";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export async function clientLoader() {
  const [status, data] = await getAllUsers();
  if (status == 401) {  // invalid jwt
    return redirect('/login');
  } else if (status == 403) { // TODO not authorized
    return redirect('/');
  }
  return data;
}

export default function UserList({
  loaderData,
}: Route.ComponentProps) {
  const users = loaderData as unknown as Users[]
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
              key={user.name}
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