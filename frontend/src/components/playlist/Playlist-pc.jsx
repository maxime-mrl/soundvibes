import { PlayCta, PlaylistCover } from "../";

export default function PlaylistPC({ playlist }) {
    function ctaClick() {

    }
    return (
        <div className="playlist-card pc">
            <PlaylistCover playlist={playlist} />
            <p>{playlist.name}</p>
            <PlayCta clickAction={ctaClick} />
        </div>
    )
}
