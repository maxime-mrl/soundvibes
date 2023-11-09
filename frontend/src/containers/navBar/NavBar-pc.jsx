import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { SoundWaves } from "../../components";


export default function NavBarPC() {
    return (
        <nav className="navbar-pc">
            <ul>
                <li>
                    <Link className="btn nav-item-pc" to="/"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-house" /> Home</Link>
                </li>
                <li>
                    <Link className="btn nav-item-pc" to="/search"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-magnifying-glass" /> Search</Link>
                </li>
                <li>
                    <Link className="btn nav-item-pc" to="/playlists"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-bars-staggered" /> Playlists</Link>
                </li>
                <li>
                    <Link className="btn nav-item-pc" to="/account"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-user" /> Account</Link>
                </li>
                <li>
                    <Link className="btn nav-item-pc" to="/admin"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-gears" /> Manage musics</Link>
                </li>
            </ul>
            <div className="playing">
                <div className="playing-title">
                    <SoundWaves></SoundWaves>
                    <p>Now playing</p>
                </div>
                <div className="music-infos">
                    <img src="cover-img" alt={`Album cover for ${"a"}`} />
                    <div className="text">
                        <h2 className="h2">Never gonna Gi...</h2>
                        <h3 className="h3">Music artist</h3>
                    </div>
                </div>
            </div>
        </nav>
    )
}
