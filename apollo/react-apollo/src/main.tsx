import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, gql, fromPromise } from '@apollo/client';
import UserLayout from "~/pages/UserLayout";
import AdminLayout from './pages/admin/Layout';
import PostList from './pages/PostList';
import './main.css';
import UserList from './pages/admin/UserList';
import LoginPage from './pages/login/LoginPage';
import { AuthProvider } from './contexts/UserRoleContext';
import AuthGate from './pages/AuthGate';
import Cookies from 'js-cookie';

const apolloClient = new ApolloClient({
   cache: new InMemoryCache(),
});

const httpLink = new HttpLink({
   uri: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
   credentials: 'include', // Ensures cookies are sent
});

const refreshTokenApolloClient = new ApolloClient({
   link: new HttpLink({
      uri: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
      credentials: 'include', // Ensures cookies are sent
   }),
   cache: new InMemoryCache(),
});

const authLlink = new ApolloLink((operation, forward) => {
   const expireAt = Cookies.get('TokenExpireAt');
   if (!expireAt || Date.now() / 1000 > Number(expireAt) - 10) {
      return fromPromise(refreshTokenApolloClient.mutate({ mutation: gql`mutation { refreshLogin { id, roles } }` }).catch(() => null)).flatMap((v) => {
         return forward(operation);
      });
   }
   return forward(operation);
});

apolloClient.setLink(ApolloLink.from([authLlink, httpLink]));

const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

const router = createBrowserRouter([
   {
      Component: AuthGate,
      errorElement: <NotFoundPage />,
      children: [
         {
            path: "/",
            Component: UserLayout,
            errorElement: <NotFoundPage />,
            children: [
               { Component: PostList, index: true },
            ]
         },
         {
            path: "/admin",
            Component: AdminLayout,
            children: [
               { Component: UserList, index: true },
            ]
         },
      ]
   },
   {
      path: "/login",
      Component: LoginPage,
   },
   {
     path: '*',
     Component: NotFoundPage,
   },
]);

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <AuthProvider>
         <ApolloProvider client={apolloClient}>
            <RouterProvider router={router} />
         </ApolloProvider>
      </AuthProvider>
   </StrictMode>,
);
