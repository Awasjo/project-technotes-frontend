import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing') //we will have access to the state and will not expire by a set amount of time by default, it will un subscribe when we log out or when we are not in protected mode.
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate()) //manual subscription, we call the end point, get the notes
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch