import { Link } from "react-router-dom";
import PlaylistCover from "../playlistCover/PlaylistCover";

export default function PlaylistMobile({ playlist, role }) {
    return (
        <Link to={role && role === "recommendation" ? `/details/recommendation?id=${playlist._id}` : `/details/playlist?id=${playlist._id}`} className="playlist-card mobile">
            <PlaylistCover playlist={playlist} />
            <p><i>{playlist.name}</i></p>
        </Link>
    )
}
