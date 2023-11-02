import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//this provides a way to interact with server's API from react front end
//create api function is used to create api client
//base query fetchbase query sets all api requests made through this api client to local host 3500
//tag types represnts the data we will be working with in the app allowed us to manage the data througn caching 
//end points allows us to define api end points for this app, not sure about this, but it seems to connect other APIs we would make here in the front end
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3500'}),
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})