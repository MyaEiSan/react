import React, { useContext } from 'react'
import {
    Navigate,
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import Home from '../pages/Home.jsx'
import Layout from "../pages/layouts/Layout.jsx";
import BookForm from "../pages/BookForm.jsx";
import Search from "../pages/Search.jsx";
import BookDetail from "../pages/BookDetail.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";

export default function index() {

    let { authReady, user } = useContext(AuthContext);
    const isAuthenticated = Boolean(user);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "", 
                    element: isAuthenticated ? <Home/> : <Navigate to="/login" />
                },
                {
                    path: '/books/:id',
                    element: isAuthenticated ? <BookDetail/> : <Navigate to="login" />
                },
                {
                    path: "/create", 
                    element: isAuthenticated ? <BookForm/> : <Navigate to="/login" />
                },
                {
                    path: "/edit/:id", 
                    element: isAuthenticated ? <BookForm/> : <Navigate to="/login" />
                },
                {
                    path: "/search", 
                    element: isAuthenticated? <Search/> : <Navigate to="/login" />
                },
                {
                    path: "/register", 
                    element: !isAuthenticated? <Register/> : <Navigate to="/" />
                },
                {
                    path: "/login", 
                    element: !isAuthenticated? <Login/> : <Navigate to="/" />
                }
            ]
        },
    ]);

  return (
    authReady && <RouterProvider router={router} />
  )
}
