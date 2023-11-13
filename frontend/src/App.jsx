import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Home, Login, Register } from "./pages";
import { NavBar, Player } from "./containers";


export default function App() {
  return (
    <DataProvider>
      <Router>
          <Routes>
            <Route element={ <LoggoutRoutes /> }>
              <Route path="/login" element={ <Login /> } />
              <Route path="/register" element={ <Register /> } />
            </Route>
            <Route element={ <LoggedRoutes /> }>
                <Route path="/" element={ <Home /> } />
            </Route>
          </Routes>
      </Router>
      <ToastContainer />
    </DataProvider>
  );
}

const LoggedRoutes = () => (
  localStorage.getItem("user") ? 
  <>
    <NavBar />
    <div className="content">
      <Outlet />
    </div>
    <Player />
  </> 
  : <Navigate to="/register" />
)

const LoggoutRoutes = () => (
  !localStorage.getItem("user") ? 
  <>
    <Outlet />
  </> 
  : <Navigate to="/" />
)
