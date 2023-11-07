import NewNoteForm from './NewNoteForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const NewNote = () => {
    const users = useGetUsersQuery("userList",{
        selectFromResult: ({data}) =>({
            user: data?.ids.map(id => data?.entities[id])
        })
    })

    //when we go into this page, we get an error, because we dont get users back so it was changed to below as a place holder for now
    if (!users?.length) return <p>Not Currently Available</p>

    const content =  <PulseLoader color={"#FFF"} />

    return content
}
export default NewNote