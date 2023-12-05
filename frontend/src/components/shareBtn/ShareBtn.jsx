import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export default function ShareBtn() {
    function copy() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success("Successfully copied link to clipboard!"))
            .catch(() => toast.error("Could not copy the link " + window.location.href));
    }

    return (
        <button className="btn" onClick={copy}>
            <FontAwesomeIcon icon="fa-solid fa-share" /> Share
        </button>
    )
}
