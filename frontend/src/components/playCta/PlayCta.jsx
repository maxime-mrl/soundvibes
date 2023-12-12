import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayCta.css";

export default function PlayCta({ clickAction }) {
    return (
        <button className="play-cta-btn" onClick={clickAction}>
            <FontAwesomeIcon icon="fa-solid fa-play" />
        </button>
    )
}
