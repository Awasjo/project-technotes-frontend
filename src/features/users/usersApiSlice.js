import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

//we are adding an end point now, for the users, we already have the base url in the apiSlice defined in the app folder
//the end points here is like the end points of the URL, we have get users, so will be adding the rest of the crud operations
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, //will keep the data for 5 second, the default is 60 seconds in the cache
      transformResponse: (responseData) => {
        //geting the response form trhe query, we are mapping over the data, and we are setting the user.id property to yhe user._id, because we are looking for an id property, and then we retrn the userAdapter and add the loaded users into it, from mongoDB
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        //provides the tags that can be invalidated, checking if there is an id's property, and if there isnt we just return user and id list, basiaclly if we dont get id we didnt get the data we wanted.
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    //passing in some initial user data, ussing the post method and then passing in the initial user data in the body, the user list will be invalidated so that will be updated
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    //similar to the above endpoint, this will be used to update user information, passing in initial data and then passing that into app api slide which then passes through the back end
    updatedUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    //same idea here but instead of spreading the user data, we only fetch the id of the user
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

//these are hooks that are automatically created when we add the end points above
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdatedUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
