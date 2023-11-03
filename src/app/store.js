import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from './../features/auth/authSlice'

export const store = configureStore({ //creating the store.
    reducer: { //
        [apiSlice.reducerPath]: apiSlice.reducer, //manages all api requests and their related states
        auth: authReducer //manages all auth  states
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware), // default handling of middleware, should always be in everyone's store since it's in charge of cleaning up, poling and so on
    devTools: true //using dev tools browser extension. 
})

setupListeners(store.dispatch) //allows us to use this to set up listeners in the users list and notes list