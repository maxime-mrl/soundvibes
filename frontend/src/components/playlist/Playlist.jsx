import { useContext } from "react";
import Datactx from "../../context/DataContext";

import PlaylistMobile from "./Playlist-mobile";
import PlaylistPC from "./Playlist-pc";
import "./Playlist.css";

export default function Playlist({ playlist, role }) {
    const { windowSize: {width}, mobileWidth } = useContext(Datactx);
    return (
        <>
            {
                width < mobileWidth ? <PlaylistMobile playlist={playlist} role={role} /> : <PlaylistPC playlist={playlist} role={role} />
            }
        </>
    )
}
