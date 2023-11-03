import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  //extending apai slice with additional api endpoints specific to authentication.
  endpoints: (builder) => ({
    login: builder.mutation({
      //mutation since we are changing not creating
      query: (credentials) => ({//passing the user name and the password
        url: "/auth", //this url in the address bar on the browser would be localhost/auth/
        method: "POST",
        body: { ...credentials }, //spread the object we expect to receive the credentials such as user name and password fields
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout", //this url in the address bar on the browser would be localhost/auth/logout
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        //this is call back function that get executed when this end point is initiated
        try {
          //const { data } =
          await queryFulfilled; //waits for the query to finish before going to the next line, to be exact, waits for this mutation end point to finish successfully
          //console.log(data)
          dispatch(logOut()); //this is a logout reducer that is made, and its dispatched to log the user out, to clear the token by making it null
          dispatch(apiSlice.util.resetApiState()); // reset the API state, possibly to handle any cleanup related to the API request
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
