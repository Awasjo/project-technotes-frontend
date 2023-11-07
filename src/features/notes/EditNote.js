import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const EditNote = () => {
  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth(); 

  const { note } = useGetNotesQuery("userList", { //getting the note
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  const users = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => ({
      user: data?.ids.map((id) => data?.entities[id]), //the ids are iterable and the entities are not, so we are mapping over it for each id we are grabbing the entitity, getting a users array.
    }),
  });

  if(!note||!users?.length) return <PulseLoader  color={"#FFF"}/>;

  //adding extra security layer 
  if(!isManager && !isAdmin) {
    if(note.username !== username) {
      return <p className="errmsg">No Access</p>
    }
  }
const content =<EditNoteForm note={note} users={users}/>

  return content;
};
export default EditNote;
