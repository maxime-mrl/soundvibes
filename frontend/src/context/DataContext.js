import { createContext, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useMusic from "../hooks/useMusic";
import useNotification from "../hooks/useNotifications";

const Datactx = createContext({});

export function DataProvider({ children }) {
    useNotification();
    const windowSize = useWindowSize();
    const mobileWidth = 700;
    const [music, setMusic, resetMusic] = useMusic();
    const [addPlaylist, setAddPlaylist] = useState(false)

    return (
        <Datactx.Provider value={{
            windowSize, mobileWidth,
            music, setMusic, resetMusic,
            addPlaylist, setAddPlaylist
        }} >
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
