import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CoverImage, SoundWaves } from "../../components";
import Datactx from "../../context/DataContext";
import { useSelector } from "react-redux";


export default function NavBarPC() {
    const { music:{title, artist, isPlaying}, music } = useContext(Datactx);
    const { user } = useSelector(state => state.auth)
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
                    <Link className="btn nav-item-pc" to="/profile"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-user" /> Account</Link>
                </li>
                {(user && user.right && user.right > 0) ?
                    <li>
                        <Link className="btn nav-item-pc" to="/admin"><FontAwesomeIcon className="nav-icon" icon="fa-solid fa-gears" /> Manage musics</Link>
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
                <div className="music-infos">
                    <CoverImage music={music}/>
                    <div className="text">
                        <h2 className="h2">{title}</h2>
                        <h3 className="h3">{artist}</h3>
                    </div>
                </div>
            </div>
        </nav>
    )
}
