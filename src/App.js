import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";

function App() {
  return (
    <Routes>
      {/* here we have the path going to a layout, this is not the index page */}
      <Route path="/" element={<Layout />}>
        {/* the below here is the index page  */}
        <Route index element={<Public />} />
        {/* again below is not an index, its denoted by a path  */}
        <Route path="login" element={<Login />} />
        {/*These are all the protected routed */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              {/* this is the protected route */}
              <Route path="dash" element={<DashLayout />}>
                {/* this is the index for the protect routes */}
                <Route index element={<Welcome />} />

                {/* the domain will show as domain/dash/users */}
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    {/* the path is going to be the id parameter */}
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                {/* the domain will show as domain/dash/notes */}
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
              {/*End of dash, which is the end of the protected routes*/}
            </Route>
          </Route>
        </Route>
        {/*End of protected routes*/}
      </Route>
    </Routes>
  );
}

export default App;
