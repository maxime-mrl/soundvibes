import { useContext, useEffect } from "react";
import Datactx from "../../context/DataContext";
import "./Loader.css";

export default function Loader() {
    const { isLoading } = useContext(Datactx);
    if (isLoading) return (
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
    ); else return (<></>);
}
