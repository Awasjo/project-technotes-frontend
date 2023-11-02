import{Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';



function App() {
  return (
    <Routes>
      {/* here we have the path going to a layout, this is not the index page */}
      <Route path="/" element={<Layout />}>
        {/* the below here is the index page  */}
      <Route index element={<Public />}/> 
      {/* again below is not an index, its denoted by a path  */}
      <Route path="login" element={<Login />}/>

      {/* this is the protected route */}
      <Route path="dash" element={<DashLayout />}>

      </Route>

      </Route>
    </Routes>
  );
}

export default App;
