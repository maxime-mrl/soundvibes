import { Song } from "../../components";
import "./SongList.css";

export default function SongList({ musics }) {
    return (
        <>
            {musics.map(music => (
                <Song key={music._id} details={music} />
            ))}
        </>
    )
}
