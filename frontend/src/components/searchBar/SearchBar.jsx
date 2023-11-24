import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { reset, searchMusics } from "../../features/musics/musicsSlice";
import "./SearchBar.css";

export default function SearchBar() {
    const dispatch = useDispatch()
    const [search, setSearch] = useState("");
    useEffect(() => {
        if (search === "") dispatch(reset());
        else dispatch(searchMusics(search));
    }, [search, dispatch])

    return (
        <div className="search-input">
            <input className="search-bar" type="text" name="search" id="search" placeholder="Search something" value={search} onChange={(e) => setSearch(e.target.value)} />
            <label className="search-label" htmlFor="search"><FontAwesomeIcon icon={"fa-solid fa-search"} /></label>
        </div>
    )
}
