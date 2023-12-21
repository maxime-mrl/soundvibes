import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faHouse, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export default function NavBarMobile() {
    const { pathname:path } = useLocation();
    return (
        <nav className="navbar mobile">
            <ul>
                <li>
                    <Link className={`nav-item mobile ${/search/.test(path) ? "active" : ""}`} to="/search" aria-label="Search">
                        <FontAwesomeIcon className="nav-icon" icon={faMagnifyingGlass} />
                    </Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/^\W*$/.test(path) ? "active" : ""}`} to="/" aria-label="Home">
                        <FontAwesomeIcon className="nav-icon" icon={faHouse} />
                    </Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/playlists/.test(path) ? "active" : ""}`} to="/playlists" aria-label="Playlists">
                        <FontAwesomeIcon className="nav-icon" icon={faBarsStaggered} />
                    </Link>
                </li>
                <li>
                    <Link className={`nav-item mobile ${/profile|admin/.test(path) ? "active" : ""}`} to="/profile" aria-label="Account">
                        <FontAwesomeIcon className="nav-icon" icon={faUser} />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
