import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CoverImage } from "../";
import "./Song.css";

export default function Song({ details, actions, actionHandler }) {

    function trashClicked(e) {
        e.preventDefault();
        actionHandler(details);
    }

    return (
        <Link to={`/details?id=${details._id}`} className="song">
            <div className="details">
                <CoverImage music={details} />
                <div className="text">
                    <h2>{details.title}</h2>
                    <h3 className="h3">{details.artist}</h3>
                </div>
            </div>
            {!actions
            ?
            <FontAwesomeIcon className="more" icon={faChevronRight} />
            :
            (actions === "both"
            ?
            <div className="actions">
                <FontAwesomeIcon onClick={trashClicked} className="btn btn-fail-text" icon={faTrash} />
                <FontAwesomeIcon className="more" icon={faChevronRight} />
            </div>
            :
            <FontAwesomeIcon onClick={trashClicked} className="btn btn-fail-text" icon={faTrash} />
            )
            }
        </Link>
    )
}
