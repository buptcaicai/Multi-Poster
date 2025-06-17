import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { AuthContext, type TAuthContext } from "~/contexts/UserRoleContext";
import { useContext, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

const REFRESH_TOKEN = gql`mutation { refreshLogin {id, roles}}`;

export default function AuthGate() {
   const navigate = useNavigate();
   const [login, { loading }] = useMutation(REFRESH_TOKEN);
   const { user, setUser } = useContext(AuthContext) as TAuthContext;
   const location = useLocation();
   
   useEffect(() => {
      if (!user) {
         login().then(res => {
            if (res?.data?.refreshLogin) {
               setUser && setUser(res.data.refreshLogin);
            } else {
               console.error('Login refresh failed', res);
               setUser && setUser(undefined); // Clear user context if refresh fails
               navigate('/login', { replace: true });
            }
         }).catch(err => {
            console.error('Error during login refresh', err);
            setUser && setUser(undefined); // Clear user context on error
            navigate('/login', { replace: true });
         });
      }
   }, [user]);

   if (loading) {
      return <p>Loading...</p>;
   }
   if (!user) {
      return null;
   }

   console.log('location', location);
   if (user.roles.includes('admin')) {
      if (!location.pathname.startsWith('/admin')) {
         return <Navigate to="/admin" replace />;
      }
   } else {
      if (location.pathname.startsWith('/admin')) {
         return <Navigate to="/" replace />;
      }
   }
   return <Outlet />;
}
