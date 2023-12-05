import { Song } from "../../components";
import "./SongList.css";

export default function SongList({ musics, actions, actionHandler }) {
    return (
        <>
            {musics.map((music, i) => (
                <Song key={i} details={music} actions={actions} actionHandler={actionHandler} />
            ))}
        </>
    )
}
