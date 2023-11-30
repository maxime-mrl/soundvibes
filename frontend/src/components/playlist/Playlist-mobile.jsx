import PlaylistCover from "../playlistCover/PlaylistCover";

export default function PlaylistMobile({ playlist }) {
    return (
        <div className="playlist-card mobile">
            <PlaylistCover playlist={playlist} />
            <p>{playlist.name}</p>
        </div>
    )
}
