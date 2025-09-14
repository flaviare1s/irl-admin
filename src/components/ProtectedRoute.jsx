import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const ProtectedRoute = ({ children }) => {
  const user = useContext(UserContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};
