import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { reset, searchMusics } from "../../features/musicsSlice";
import Datactx from "../../context/DataContext";
import "./SearchBar.css";

export default function SearchBar() {
    const dispatch = useDispatch();
    const {search, setSearch} = useContext(Datactx);

    useEffect(() => {
        if (search === "") dispatch(reset());
        else dispatch(searchMusics(search));
    }, [search, dispatch])

    return (
        <div className="search-input">
            <input className="search-bar" type="text" name="search" id="search" placeholder="Search something" value={search} onChange={(e) => setSearch(e.target.value)} />
            <label className="search-label" htmlFor="search"><FontAwesomeIcon icon={faSearch} aria-label="Search something"/></label>
        </div>
    )
}
