import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import "./App.css"

import { Home, Login, Register } from "./pages";
import { NavBar, Player } from "./containers";
import { DataProvider } from "./context/DataContext";


export default function App() {
  localStorage.setItem("user", "test")
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
