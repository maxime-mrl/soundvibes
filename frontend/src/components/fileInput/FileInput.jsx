import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import "./FileInput.css";

export default function AddMusic({name, label, accept, update}) {
    const inputRef = useRef({ files: [] });
    
    return (
        <div className="file-input-container">
            <label htmlFor={name} className="file-label btn-cta">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
                <i>
                    {
                        inputRef.current.files[0] ?
                        (inputRef.current.files[0].name.slice(0, label.length - 3) + "...") :
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
