import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { isTokenExpired } from "../../utils/authHelper";

const ProtectedRoute = () => {
  const {accessToken, exp} = useSelector((state: RootState) => state.auth);
  
  return (!accessToken || isTokenExpired(exp))? 
  // store the attempted path in `returnTo` query param
  (<Navigate 
    to="/login" 
    state={{ from: location }} replace />
  ) : (
    <Outlet/>
  )
}

export default ProtectedRoute