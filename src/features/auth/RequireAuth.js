import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";



const RequireAuth = ({allowedRoles}) => {
    const location = useLocation()
    const { roles } = useAuth() //roles array from use auth

    //array.some function returns true if one of the elements in the array passes the condition within the some function parenthesis 
    const content = (
        roles.some(role => allowedRoles.includes(role))?<Outlet/>:<Navigate to="/login" state={{from: location}} replace /> //replace the history with the navigate
    )
    return content
}

export default RequireAuth