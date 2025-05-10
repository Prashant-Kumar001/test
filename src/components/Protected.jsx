import React from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

export const Protected = ({
    isAuthenticated,
    children,
    adminOnly,
    admin,
    redirect = "/",
}) => {
    if (!isAuthenticated) return <Navigate to={redirect} />;

    if (adminOnly && !admin) return <Navigate to={redirect} />;

    return children ? children : <Outlet />;
};

