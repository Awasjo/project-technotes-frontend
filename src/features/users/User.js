import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";

const User = ({userId}) => {

    const{user} = useGetUsersQuery("usersList", {
        selectFromResult: ({data})=>({
            user:data?.entities[userId]
        })
    })

    const navigate = useNavigate()

    if(user){
        const handleEdit = () => navigate(`/dash/users/${userId}`) //this handles the navigation to get userId so that we can edit it, we would add this to the app routes

        const userRolesString = user.roles.toString().replaceAll(',',', ') // replaces all the commas in the array with a comma and space, the roles is an array of string in the user schema

        const cellStatus = user.active?'':'table++cell--inactive' //help an inactive class for in active users

        return(
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    }else return null
}
const memoizedUser = memo(User)
export default memoizedUser