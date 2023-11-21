import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Datactx, { DataProvider } from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Home, Login, Register, Search, SongDetails } from "./pages";
import { NavBar, Player } from "./containers";
import { useContext } from "react";
import { ScrollTop } from "./components";


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
              <Route path="/search/*" element={ <Search /> } />
              <Route path="/details/*" element={ <SongDetails /> } />
              <Route path="/" element={ <Home /> } />
            </Route>
            <Route path="*" element={ <h1 className="h1">404 WIP</h1> } />
          </Routes>
      </Router>
      <ToastContainer />
    </DataProvider>
  );
}

const LoggedRoutes = () => {
  const { windowSize: {width}, mobileWidth } = useContext(Datactx);
  return (
  localStorage.getItem("user") ? // using localstorage because useSelector will update as soon as there is a change thus preventing success toast
  <div className={width < mobileWidth ? "page mobile" : "page pc"}>
    <ScrollTop />
    <NavBar />
    <div className="content">
      <Outlet />
    </div>
    <Player />
  </div>
  : <Navigate to="/register" />
)
}

const LoggoutRoutes = () => (
  !localStorage.getItem("user") ? 
  <>
    <Outlet />
  </> 
  : <Navigate to="/" />
)
