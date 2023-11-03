import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth', //name the slice auth
    initialState: { token: null }, //expecting to receive a token back from the API
    reducers: {
        setCredentials: (state, action) => { //reducer 1: after getting the data back , we will have a payload and that will have the accces token 
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) => { //reducer 2: setting the token back to null
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions //exported the actions

export default authSlice.reducer //exports the reducers 

export const selectCurrentToken = (state) => state.auth.token //allow us to select specific data from the state within this slice
//will be exported into the store js file in app folder