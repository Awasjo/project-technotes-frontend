import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        // Prefetch data for 'getNotes' from the 'notesApiSlice'.
        // This API call fetches the 'notesList' and stores it in Redux state for use throughout the application.
        // The 'force: true' option ensures that the data is fetched even if it's already in the cache.
        store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true })) 
    }, [])

    return <Outlet />
}
export default Prefetch