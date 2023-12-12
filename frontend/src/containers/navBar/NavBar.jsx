import { useContext } from "react";
import Datactx from "../../context/DataContext";

import NavBarPC from "./NavBar-pc";
import NavBarMobile from "./NavBar-mobile";
import "./NavBar.css";

export default function NavBar() {
    const { isMobile } = useContext(Datactx);
    return (
        <>
            { isMobile
            ?
                <NavBarMobile />
            :
                <NavBarPC />
            }
        </>
    )
}
