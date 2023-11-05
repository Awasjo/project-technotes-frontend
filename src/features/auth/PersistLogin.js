import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice" 
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"

const PersistLogin = () => {

    const [persist] = usePersist() //just persist since we are not setting persist here, we are setting it in the login.js file
    const token = useSelector(selectCurrentToken) //this is the access token
    const effectRan = useRef(false) //handling strict mode for react 18 (1 year ago)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized, //refresh has not been called yet as a state
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation() //refresh mutation hook.


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode, in dev it mounts two time. since we use create react app, its strict by default, this is only a problem when we get the refresh token, we only need to send it one time.

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token') //see it happen. 
                try {
                    //const response = 
                    await refresh() //it doesnt happen right away, so we set the true success we get some time for the credentials to set as we did below
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken() //this is what happens when we refresh the page, we just send the cookie back, and then it gives access to the other states since we get a new access token
        }

        return () => effectRan.current = true //will hold the true value even after it unmounts and remounts

        // eslint-disable-next-line
    }, [])


    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet /> //this will go to the child route which will either be login, or dash. dash is when successful token, login is when its not 
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>//we dont have the token yet, we are setting the auth 
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>. {/*this link tag allows us to navigate to another location, in this case /login which is within this folder structure*/}
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default PersistLogin