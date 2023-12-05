import { CoverImage } from "../";
import "./PlaylistCover.css";

export default function PlaylistCover({ playlist }) {
    return (
        <div className="playlist-img">
            {!playlist || !playlist.content[0]
                ?
                <CoverImage />
                :
                (playlist.content.length < 3
                    ?
                    <CoverImage music={playlist.content[0]} />
                    :
                    playlist.content.slice(0, 4).map((music, i) => ( <CoverImage music={music} key={i} /> ))
                )
            }
        </div>
    )
}
