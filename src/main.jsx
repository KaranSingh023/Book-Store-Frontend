
import React from "react";
import ReactDOM from "react-dom/client";
// Our pages routs //
import App from './App.jsx';
import BestSelling from "./pages/BestSelling.jsx";
import TopLikes from "./pages/TopLikes.jsx";
import AllBooks from "./pages/AllBooks.jsx";
import Search from "./pages/Search.jsx";
import Category from "./pages/Category.jsx";
import CategoryDetail from './pages/CategoryDetail.jsx';
import TopRated from './pages/TopRated';
// Our BootStrap//
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {path:"/bestselling",element:<BestSelling/>},
  {path:"/toplikes",element:<TopLikes/>},
  {path:"/allbooks",element:<AllBooks/>},
  {path:"/search",element:<Search/>},
  {path:"/category",element:<Category/>},
  { path: "/category/:type", element: <CategoryDetail /> },
  {path:"/toprated", element:<TopRated/>}

]);
 root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
