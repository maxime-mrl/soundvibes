import { CoverImage } from "../";
import "./PlaylistCover.css";

export default function PlaylistCover({ playlist }) {
    return (
        <div className="playlist-img">
            {!playlist || !playlist.content[0]
            ?
            <CoverImage />
            :
            playlist.content.slice(0, 3).map((music, i) => (
                <CoverImage music={music} />
            ))
            // (playlist.content.length > 1)
            }
        </div>
    )
}
