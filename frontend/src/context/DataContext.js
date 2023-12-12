import { createContext, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useMusic from "../hooks/useMusic";
import useNotification from "../hooks/useNotifications";

const Datactx = createContext({});

export function DataProvider({ children }) {
    useNotification();
    const [windowSize, isMobile] = useWindowSize();
    const [music, updateMusic, resetMusic, playNewMusic] = useMusic();
    const [addPlaylist, setAddPlaylist] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <Datactx.Provider value={{
            windowSize, isMobile,
            music, updateMusic, resetMusic, playNewMusic,
            addPlaylist, setAddPlaylist,
            search, setSearch
        }} >
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
