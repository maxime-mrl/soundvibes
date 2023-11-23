import { createContext } from "react";
import useWindowSize from "../hooks/useWindowSize";
import useMusic from "../hooks/useMusic";
import useLoading from "../hooks/useLoading";

const Datactx = createContext({});

export function DataProvider({ children }) {
    const windowSize = useWindowSize();
    const mobileWidth = 700;
    const [music, setMusic, resetMusic] = useMusic();
    const isLoading = useLoading();

    return (
        <Datactx.Provider value={{
            windowSize, mobileWidth,
            music, setMusic, resetMusic,
            isLoading
        }} >
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
