import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./PlayCta.css";

export default function PlayCta({ clickAction }) {
    return (
        <button className="play-cta-btn" onClick={clickAction} aria-label="play">
            <FontAwesomeIcon icon={faPlay} />
        </button>
    )
}
