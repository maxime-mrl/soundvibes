import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CoverImage } from "../";
import "./Song.css";

export default function Song({ details }) {
    return (
        <Link to={`/details?id=${details._id}`} className="song">
            <div className="details">
                <CoverImage music={details} />
                <div className="text">
                    <h2>{details.title}</h2>
                    <h3 className="h3">{details.artist}</h3>
                </div>
            </div>
            <FontAwesomeIcon className="more" icon={"fa-solid fa-chevron-right"} />
        </Link>
    )
}
