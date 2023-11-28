import { Song } from "../../components";
import "./SongList.css";

export default function SongList({ musics }) {
    return (
        <>
            {musics.map((music, i) => (
                <Song key={i} details={music} />
            ))}
        </>
    )
}
