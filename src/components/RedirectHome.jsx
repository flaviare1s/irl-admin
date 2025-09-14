import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Login } from "../pages/Login";

export const RedirectHome = () => {
  const user = useContext(UserContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};
