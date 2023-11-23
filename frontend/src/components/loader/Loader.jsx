import { useContext, useEffect } from "react";
import Datactx from "../../context/DataContext";
import "./Loader.css";

export default function Loader({isFullSize}) {
    const { isLoading } = useContext(Datactx);
    useEffect(() => {
        console.log(isLoading)
    }, [isLoading])
    // const isLoading = true;
    if (!isFullSize && isLoading) return (
        <div className="loader-container">
            <div className="loader">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            </div>
        </div>
    ); else if (isLoading) return (
        <div className="loader">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
        </div>
    ); else return (<></>);
}
