import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken); //select the token from the selector thats passed into the useselector
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    const decoded = jwtDecode(token); //decode the token with jwtdecode
    const { username, roles } = decoded.UserInfo; //destructure these from the access token, we put it into a UserInfo property in the server side, this is found in the authController.js in the server side

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager"; //set the status to the highest level
    if (isAdmin) status = "Admin"; //set the status to the highest level

    return { username, roles, status, isManager, isAdmin }; //we can destruct  this out of this hook when we need it
  }

  return { username: "", roles: [], isManager, isAdmin, status }; //this is returned if we dont have a token
};
export default useAuth;
