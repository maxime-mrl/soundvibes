import { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SearchBar.css";
import { reset, searchMusics } from "../../features/musics/musicsSlice";

export default function SearchBar() {
    const dispatch = useDispatch()
    const [search, setSearch] = useState("");

    function updateSearch(e) {
        setSearch(e.target.value);
        if (e.target.value === "") {
            dispatch(reset());
        } else {
            dispatch(searchMusics(e.target.value));
        }
    }

    return (
        <div className="search-input">
            <input className="search-bar" type="text" name="search" id="search" placeholder="Search something" value={search} onChange={updateSearch} />
            <label className="search-label" htmlFor="search"><FontAwesomeIcon icon={"fa-solid fa-search"} /></label>
        </div>
    )
}
