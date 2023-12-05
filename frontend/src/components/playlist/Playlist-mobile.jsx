import { Link } from "react-router-dom";
import PlaylistCover from "../playlistCover/PlaylistCover";

export default function PlaylistMobile({ playlist }) {
    return (
        <Link to={`/details/playlist?id=${playlist._id}`} className="playlist-card mobile">
            <PlaylistCover playlist={playlist} />
            <p>{playlist.name}</p>
        </Link>
    )
}
