import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function NavBarMobile() {
    return (
        <nav className="navbar-mobile">
            <ul>
                <li>
                    <Link className="nav-item-mobile" to="/search"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-magnifying-glass" /></Link>
                </li>
                <li>
                    <Link className="nav-item-mobile" to="/"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-house" /></Link>
                </li>
                <li>
                    <Link className="nav-item-mobile" to="/playlists"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-bars-staggered" /></Link>
                </li>
                <li>
                    <Link className="nav-item-mobile" to="/account"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-user" /></Link>
                </li>
            </ul>
        </nav>
    )
}
