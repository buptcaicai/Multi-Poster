import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Root from "~/pages/Layout";
import AdminLayout from './pages/admin/Layout';
import PostList from './pages/PostList';
import './main.css';
import UserList from './pages/admin/UserList';

const apolloClient = new ApolloClient({
   uri: `${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
   cache: new InMemoryCache(),
});

apolloClient
   .query({
      query: gql`
    query Post {
        posts {
            _id,
            name,
            text
        }
    }
  `,
   }).then((result) => console.log('GraphQL Result:', result));


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
   }
   // {
   //   path: '*',
   //   Component: NotFoundPage,
   // },
]);

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <ApolloProvider client={apolloClient}>
         <RouterProvider router={router} />
      </ApolloProvider>
   </StrictMode>,
);
