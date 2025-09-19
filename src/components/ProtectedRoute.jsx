import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = useContext(UserContext);
  if (!user) return <Navigate to="/401" />;
  return children;
};
