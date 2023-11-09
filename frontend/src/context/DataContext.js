import { createContext } from "react";
import useWindowSize from "../hooks/useWindowSize";

const Datactx = createContext({});

export function DataProvider({ children }) {
    const windowSize = useWindowSize();
    const mobileWidth = 700;
    return (
        <Datactx.Provider value={{
            windowSize, mobileWidth
        }} >
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
