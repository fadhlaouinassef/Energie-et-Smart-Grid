import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";

/** Affiche la page demandée si le cookie de session existe, sinon renvoie vers /signin. */
export default function RequireAuth({ children }) {
  const location = useLocation();
  if (isAuthenticated()) return children;
  return <Navigate to="/signin" replace state={{ from: location }} />;
}
