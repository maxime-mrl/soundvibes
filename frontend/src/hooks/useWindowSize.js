import { useEffect, useState } from "react";
const mobileWidth = 700;

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize' , handleResize) };
    }, [])

    function handleResize() {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
        setIsMobile(window.innerWidth < mobileWidth);
    };

    return [windowSize, isMobile]
}
