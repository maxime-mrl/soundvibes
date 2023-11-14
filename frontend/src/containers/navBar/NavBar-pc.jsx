import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CoverImage, SoundWaves } from "../../components";
import { useContext } from "react";
import Datactx from "../../context/DataContext";


export default function NavBarPC() {
    const { music:{name, artist, isPlaying} } = useContext(Datactx);
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
                {isPlaying &&
                    <div className="playing-title">
                        <SoundWaves></SoundWaves>
                        <p>Now playing</p>
                    </div>
                }
                <div className="music-infos">
                    <CoverImage />
                    <div className="text">
                        <h2 className="h2">{name}</h2>
                        <h3 className="h3">{artist}</h3>
                    </div>
                </div>
            </div>
        </nav>
    )
}
