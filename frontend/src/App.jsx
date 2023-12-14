import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Datactx, { DataProvider } from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { Admin, Home, Login, PlaylistDetails, Playlists, Profile, RecommendationDetails, Register, Search, SongDetails } from "./pages";
import { AddPlaylist, NavBar, Player } from "./containers";
import { useContext } from "react";
import { ScrollTop } from "./components";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
              <Route path="/search" element={ <Search /> } />
              <Route path="/details" element={ <SongDetails /> } />
              <Route path="/details/playlist" element={ <PlaylistDetails /> } />
              <Route path="/details/recommendation" element={ <RecommendationDetails /> } />
              <Route path="/profile" element= { <Profile /> } />
              <Route path="/playlists" element= { <Playlists /> } />
              <Route path="/admin" element= { <Admin /> } />
              <Route path="/" element={ <Home /> } />
            </Route>
            
            <Route path="*" element={ <Navigate to="/" /> } />
          </Routes>
      </Router>
      <ToastContainer />
    </DataProvider>
  );
}

const LoggedRoutes = ({user}) => {
  const { isMobile } = useContext(Datactx);
  return (
  user ?
  <div className={isMobile ? "page mobile" : "page pc"}>
    <ScrollTop />
    <AddPlaylist />
    <NavBar />
    <div className="content">
      <Outlet />
    </div>
    <Player />
  </div>
  : <Navigate to="/register" />
)
}

const LoggoutRoutes = ({user}) => (
  !user ?
  <>
    <Outlet />
  </> 
  : <Navigate to="/" />
)
