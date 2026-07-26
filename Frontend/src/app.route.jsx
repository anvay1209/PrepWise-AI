import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/protected";
import Layout from "./components/Layout.jsx";
import Dashboard from "./features/interview/pages/dashboard";
import GenerateReport from "./features/interview/pages/generatereport";
import GenerateResume from "./features/resume/pages/generateResume";
import Interview from "./features/interview/pages/interview";
import About from "./features/static/about";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Protected><Dashboard /></Protected>
            },
            {
                path: "/dashboard",
                element: <Protected><Dashboard /></Protected>
            },
            {
                path: "/generate-resume",
                element: <Protected><GenerateResume /></Protected>
            },
            {
                path: "/generate-report",
                element: <Protected><GenerateReport /></Protected>
            },
            {
                path: "/interview/report/:interviewId",
                element: <Protected><Interview /></Protected>
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "*",
                element: <Navigate to="/dashboard" replace />
            }
        ]
    }
]);