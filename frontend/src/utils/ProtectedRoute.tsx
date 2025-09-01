import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { isTokenExpired } from "./authHelper";

const ProtectedRoute = () => {
  const {accessToken, exp} = useSelector((state: RootState) => state.auth);
  
  return (!accessToken || isTokenExpired(exp))? 
  // store the attempted path in `returnTo` query param
  (<Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
    replace />) : (
    <Outlet/>
  )
}

export default ProtectedRoute