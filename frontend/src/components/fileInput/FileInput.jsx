import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FileInput.css";
import { useRef } from "react";

export default function AddMusic({name, label, accept, update}) {
    const inputRef = useRef({ files: [] });
    return (
        <div className="file-input-container">
            <label htmlFor={name} className="file-label btn-cta">
                <FontAwesomeIcon icon="fa-solid fa-arrow-up-from-bracket" />
                <i>
                    {
                        inputRef.current.files[0] ?
                        (inputRef.current.files[0].name.slice(0, 12) + "...") :
                        (label)
                    }
                </i>
                
            </label>
            <input
                ref={inputRef}
                className="file-input"
                type="file"
                accept={accept}
                name={name}
                id={name}
                onChange={update}
            />
        </div>
    )
}
