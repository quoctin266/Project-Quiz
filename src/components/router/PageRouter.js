// import User from "../user/User";
import Admin from "../admin/Admin";
import Home from "../home/Home";
import App from "../../App";
import ManageUser from "../../components/admin/content/user/ManageUser";
import DashBoard from "../admin/content/DashBoard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ListQuiz from "../user/ListQuiz";
import DetailQuiz from "../user/DetailQuiz";
import NotFound from "./NotFound";
import ManageQuiz from "../admin/content/quiz/ManageQuiz";
import ManageQA from "../admin/content/qa/ManageQA";
import PrivateRoute from "../private-route/PrivateRoute";
import { Suspense } from "react";
import LimitedAccess from "./LimitedAccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user",
        // pass listquiz component as a prop (children) to privateroute
        element: (
          <PrivateRoute>
            <ListQuiz />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    // pass admin component as a prop (children) to privateroute
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
    children: [
      {
        path: "manage-users",
        element: <ManageUser />,
      },
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "manage-quiz",
        element: <ManageQuiz />,
      },
      {
        path: "manage-qa",
        element: <ManageQA />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/quiz/:id",
    element: <DetailQuiz />,
  },
  {
    path: "/access-not-allowed",
    element: <LimitedAccess />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const PageRouter = () => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <RouterProvider router={router} />;
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </Suspense>
  );
};

export default PageRouter;
