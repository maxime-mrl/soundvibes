import { useContext } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import { CoverImage, SoundWaves } from "../../components";
import { faBarsStaggered, faGears, faHouse, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";


export default function NavBarPC() {
    const { pathname:path } = useLocation();
    const { music:{title, artist, isPlaying}, music } = useContext(Datactx);
    const { user } = useSelector(state => state.auth)
    return (
        <nav className="navbar pc">
            <ul>
                <li>
                    <Link className="btn nav-item pc" to="/"><FontAwesomeIcon className={`nav-icon ${/^\W*$/.test(path) ? "active" : ""}`} icon={faHouse} /> Home</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/search"><FontAwesomeIcon className={`nav-icon ${/search/.test(path) ? "active" : ""}`} icon={faMagnifyingGlass} /> Search</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/playlists"><FontAwesomeIcon className={`nav-icon ${/playlists/.test(path) ? "active" : ""}`} icon={faBarsStaggered} /> Playlists</Link>
                </li>
                <li>
                    <Link className="btn nav-item pc" to="/profile"><FontAwesomeIcon className={`nav-icon ${/profile/.test(path) ? "active" : ""}`} icon={faUser} /> Account</Link>
                </li>
                {(user && user.right && user.right > 0) ?
                    <li>
                        <Link className="btn nav-item pc" to="/admin"><FontAwesomeIcon className={`nav-icon ${/admin/.test(path) ? "active" : ""}`} icon={faGears} /> Manage musics</Link>
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
                {music.id ?
                <Link to={`/details?id=${music.id}`} className="music-infos">
                    <CoverImage music={music}/>
                    <div className="text">
                        {title && <h2 className="h2">{title}</h2>}
                        {artist && <h3 className="h3">{artist}</h3>}
                    </div>
                </Link>
                :
                <div className="music-infos">
                    <CoverImage music={music}/>
                    <div className="text">
                        {title && <h2 className="h2">{title}</h2>}
                        {artist && <h3 className="h3">{artist}</h3>}
                    </div>
                </div>
                }
            </div>
        </nav>
    )
}
