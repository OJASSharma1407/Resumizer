import './App.css';
import {  Routes, Route } from 'react-router-dom';
import Dashboard from './components/main/Dashboard';
import MainLayout from './components/extra/MainLayout';
import ProtectedRoutes from './components/extra/ProtectedRoutes';
import Login from './components/auth/Login';
import Signin from './components/auth/Signin';

function App() {
  return (
    <>
      <Routes>
        <Route path='/signin' element = {<Signin/>}/>
        <Route path='login' element={<Login/>}/>
        <Route element={
          <ProtectedRoutes>
            <MainLayout/>
          </ProtectedRoutes>
          }>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
