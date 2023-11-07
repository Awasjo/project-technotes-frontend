import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl : 'https://technotes-api.onredner.com', //before we only provided this, but we want to add some other things, 
    credentials: 'include',//we will always send the cookie
    prepareHeaders: (headers, {getState}) =>{//the first to be added to the headers in the fetchBaseQuery, and then it also has an api object, and we can destruct the getState from it to be included withing here, we use get state to look at the auth state and getting the token, and then assigining it to the token, if we do have something in there, and we will set the headers's authorization key to that string starting with Bearer
        const token = getState().auth.token

        if(token){
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions) //we previously defined base query

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions) //if the original token doenst work, then we get a new token 

        if (refreshResult?.data) {//data should hold the access token. 

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))//we are spreading the refreshresult data 

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions) //try the original query again. 
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. " //this is when the refresh access expires
            }
            return refreshResult
        }
    }

    return result
}

//this provides a way to interact with server's API from react front end
//create api function is used to create api client
//base query fetchbase query sets all api requests made through this api client to local host 3500
//tag types represnts the data we will be working with in the app allowed us to manage the data througn caching 
//end points allows us to define api end points for this app, not sure about this, but it seems to connect other APIs we would make here in the front end
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth, //we are using the one with reauth as out base query
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})