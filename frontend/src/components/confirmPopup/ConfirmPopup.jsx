import { useRef } from "react";
import "./ConfirmPopup.css";

export default function ConfirmPopup({text, customText, cancel, confirm}) {
    const popup = useRef();
    function handleConfirm() { // show popup
        popup.current.classList.remove("shown");
        confirm();
    }
    function handleCancel() { // hide popup
        popup.current.classList.remove("shown");
        cancel();
    }
    return (
        <div className="confirm-popup" ref={popup}>
            <div className="popup">
                <p className="h2">Are you sure {text} {customText && <i></i>} ?</p>
                <button className="btn-cta btn-fail" onClick={handleConfirm}>Delete</button>
                <button className="btn-cta" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}
