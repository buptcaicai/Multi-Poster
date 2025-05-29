import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import Root from "~/pages/Layout";
import AdminLayout from './pages/admin/Layout';
import PostList from './pages/PostList';
import './main.css';
import UserList from './pages/admin/UserList';
import LoginPage from './pages/login/LoginPage';
import { AuthProvider } from './contexts/UserRoleContext';

const apolloClient = new ApolloClient({
   link: new HttpLink({
      uri: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
      credentials: 'include', // Ensures cookies are sent
   }),
   cache: new InMemoryCache(),
});

const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

const router = createBrowserRouter([
   {
      path: "/",
      Component: Root,
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
