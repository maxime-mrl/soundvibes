import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"

import { Home, Login, Register } from "./pages";
import { NavBar } from "./containers";


function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
