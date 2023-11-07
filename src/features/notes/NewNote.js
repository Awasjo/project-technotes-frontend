import NewNoteForm from './NewNoteForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const NewNote = () => {

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    //when we go into this page, we get an error, because we dont get users back so it was changed to below as a place holder for now
    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewNoteForm users={users} />

    return content
}
export default NewNote