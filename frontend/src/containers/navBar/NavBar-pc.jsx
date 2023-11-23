import { useContext } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import { CoverImage, SoundWaves } from "../../components";


export default function NavBarPC() {
    const { pathname:path } = useLocation();
    const { music:{title, artist, isPlaying}, music } = useContext(Datactx);
    const { user } = useSelector(state => state.auth)
    return (
        <nav className="navbar pc">
            <ul>
                <li>
                    <Link className="btn nav-item pc" to="/"><FontAwesomeIcon className={`nav-icon ${/^\W*$/.test(path) ? "active" : ""}`} icon="fa-solid fa-house" /> Home</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/search"><FontAwesomeIcon className={`nav-icon ${/search/.test(path) ? "active" : ""}`} icon="fa-solid fa-magnifying-glass" /> Search</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/playlists"><FontAwesomeIcon className={`nav-icon ${/playlists/.test(path) ? "active" : ""}`} icon="fa-solid fa-bars-staggered" /> Playlists</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/profile"><FontAwesomeIcon className={`nav-icon ${/profile/.test(path) ? "active" : ""}`} icon="fa-solid fa-user" /> Account</Link>
                </li>
                {(user && user.right && user.right > 0) ?
                    <li>
                        <Link className="btn nav-item pc" to="/admin"><FontAwesomeIcon className={`nav-icon ${/admin/.test(path) ? "active" : ""}`} icon="fa-solid fa-gears" /> Manage musics</Link>
                    </li>
                :
                ""
                }
            </ul>
            <div className="playing">
                {isPlaying &&
                    <div className="playing-title">
                        <SoundWaves></SoundWaves>
                        <p>Now playing</p>
                    </div>
                }
                <Link to={`/details?id=${music.id}`} className="music-infos">
                    <CoverImage music={music}/>
                    <div className="text">
                        <h2 className="h2">{title}</h2>
                        <h3 className="h3">{artist}</h3>
                    </div>
                </Link>
            </div>
        </nav>
    )
}
