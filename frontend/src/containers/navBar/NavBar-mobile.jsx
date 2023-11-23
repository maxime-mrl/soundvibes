import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

export default function NavBarMobile() {
    const { pathname:path } = useLocation();
    return (
        <nav className="navbar mobile">
            <ul>
                <li>
                    <Link className={`nav-item mobile ${/search/.test(path) ? "active" : ""}`} to="/search"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-magnifying-glass" /></Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/^\W*$/.test(path) ? "active" : ""}`} to="/"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-house" /></Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/playlists/.test(path) ? "active" : ""}`} to="/playlists"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-bars-staggered" /></Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/profile|admin/.test(path) ? "active" : ""}`} to="/profile"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-user" /></Link>
                </li>
            </ul>
        </nav>
    )
}
