import { useContext } from "react";
import { Link } from "react-router-dom";
import Datactx from "../../context/DataContext";
import { PlayCta, PlaylistCover } from "../";

export default function PlaylistPC({ playlist, role }) {
    const { playNewMusic } = useContext(Datactx);

    function ctaClick() {
        const ids = [];
        playlist.content.forEach(music => ids.push(music._id));
        playNewMusic({ids})
    }

    return (
        <div className="playlist-card pc">
            <Link to={role && role === "recommendation" ? `/details/recommendation?id=${playlist._id}` : `/details/playlist?id=${playlist._id}`} className="playlist-link">
                <PlaylistCover playlist={playlist} />
                <p>{playlist.name}</p>
            </Link>
            <PlayCta clickAction={ctaClick} />
        </div>
    )
}
