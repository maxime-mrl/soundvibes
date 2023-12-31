import { useContext } from "react";
import Datactx from "../../context/DataContext";

import PlayerMobile from "./Player-mobile";
import PlayerPC from "./Player-pc";
import "./Player.css";

export default function Player() {
    const { isMobile } = useContext(Datactx);
    return (
        <>
            <audio className="audio-player">
                <source type="audio/mpeg"/>
            </audio>
            { isMobile
            ?
                <PlayerMobile />
            :
                <PlayerPC />
            }
        </>
    )
}
