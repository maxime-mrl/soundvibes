import { createContext } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useMusic from "../hooks/useMusic";

const Datactx = createContext({});

export function DataProvider({ children }) {
    const windowSize = useWindowSize();
    const mobileWidth = 700;
    const [music, setMusic, resetMusic] = useMusic();

    return (
        <Datactx.Provider value={{
            windowSize, mobileWidth,
            music, setMusic, resetMusic
        }} >
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
