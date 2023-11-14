import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Home, Login, Register } from "./pages";
import { NavBar, Player } from "./containers";
import { useSelector } from "react-redux";


export default function App() {
  const { user } = useSelector(state => state.auth);
  return (
    <DataProvider>
      <Router>
          <Routes>
            <Route element={ <LoggoutRoutes user={user} /> }>
              <Route path="/login" element={ <Login /> } />
              <Route path="/register" element={ <Register /> } />
            </Route>
            <Route element={ <LoggedRoutes user={user} /> }>
                <Route path="/" element={ <Home /> } />
            </Route>
          </Routes>
      </Router>
      <ToastContainer />
    </DataProvider>
  );
}

const LoggedRoutes = ({ user }) => (
  user ? 
  <>
    <NavBar />
    <div className="content">
      <Outlet />
    </div>
    <Player />
  </> 
  : <Navigate to="/register" />
)

const LoggoutRoutes = ({ user }) => (
  !user ? 
  <>
    <Outlet />
  </> 
  : <Navigate to="/" />
)
