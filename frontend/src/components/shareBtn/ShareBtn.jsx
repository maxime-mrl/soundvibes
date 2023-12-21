import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function ShareBtn() {
    function copy() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success("Successfully copied link to clipboard!"))
            .catch(() => toast.error("Could not copy the link " + window.location.href));
    }

    return (
        <button className="btn" onClick={copy}>
            <FontAwesomeIcon icon={faShare} /> Share
        </button>
    )
}
