import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from './../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch) //alllws us to use this to set up listeners in the users list and notes list