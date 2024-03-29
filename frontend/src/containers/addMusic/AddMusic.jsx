import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addMusic } from "../../features/musicsReducer";
import { FileInput, TextInput } from "../../components";
import Datactx from "../../context/DataContext";
import "./AddMusic.css";

export default function AddMusic() {
    const dispatch = useDispatch();
    const { setSearch } = useContext(Datactx);

    const [{ title, artist, tags, year }, setFormData] = useState({
        title: ["", false],
        artist: ["", false],
        tags: ["", false],
        year: ["", false],
    });

    const [{musicFile, coverFile}, setFiles] = useState({
        musicFile: null,
        coverFile: null
    });

    function updateForm(e) {
        let isValidated = false;
        const value = e.target.value;
        const validateQuery = e.target.getAttribute("data-validate");
        /* ----------------------------- validate inputs ---------------------------- */
        const regex = new RegExp(validateQuery, "i");
        if (regex.test(value)) isValidated = true;
        /* ------------------------ inform user of validation ----------------------- */
        if (!isValidated) {
            e.target.parentNode.classList.remove("success");
            e.target.parentNode.classList.add("fail");
        } else {
            e.target.parentNode.classList.remove("fail");
            e.target.parentNode.classList.add("success");
        }
        if (value.length === 0) {
            e.target.parentNode.classList.remove("fail");
            e.target.parentNode.classList.remove("success");
        }
        /* ------------------------------ save to state ----------------------------- */
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: [e.target.value, isValidated]
        }));
    }

    function updateFiles(e) {
        setFiles(prevState => ({
            ...prevState,
            [e.target.name]: e.target.files[0]
        }));
    }
    
    function submitForm(e) {
        e.preventDefault();
        if (!title[1] || !artist[1] || !tags[1] || !year[1] || !musicFile || !coverFile) {
            toast.error("Please fill and validate all inputs!");
            return;
        }
        let data = new FormData();
        data.append("title", title[0]);
        data.append("artist", artist[0]);
        data.append("tags", tags[0]);
        data.append("year", year[0]);
        data.append("audio", musicFile);
        data.append("cover", coverFile);
        dispatch(addMusic(data));
        setSearch("");
    }

    return (
        <form onSubmit={submitForm} className="add-music-form">
            <h3 className="h2">Add music:</h3>
            <TextInput 
                label={{
                    regular: "Title",
                    error: "Invalid title, allowed: a-z, 0-9, - and space"
                }}
                input={{
                    name: "title",
                    placeholder: "Music title",
                    autoComplete: "off",
                }}
                validation={"^[()'-a-z0-9\\s]+$"}
                valueState={title[0]}
                updateForm={updateForm}
            />
            <TextInput 
                label={{
                    regular: "Artist",
                    error: "Invalid artist, allowed: a-z, 0-9, - and space"
                }}
                input={{
                    name: "artist",
                    placeholder: "Artist name",
                    autoComplete: "off",
                }}
                validation={"^[()'-a-z0-9\\s]+$"}
                valueState={artist[0]}
                updateForm={updateForm}
            />
            <TextInput 
                label={{
                    regular: "Tags (space separated)",
                    error: "Invalid tags, allowed: a-z, 0-9, and -. To set multiple tags separate them with space"
                }}
                input={{
                    name: "tags",
                    placeholder: "tag(s)",
                    autoComplete: "off",
                }}
                validation={"^[-a-z0-9\\s]+$"}
                valueState={tags[0]}
                updateForm={updateForm}
            />
            <TextInput 
                label={{
                    regular: "Publication year",
                    error: "Invalid year"
                }}
                input={{
                    name: "year",
                    placeholder: "Year",
                    autoComplete: "off",
                    type: "number"
                }}
                validation={"^[0-9]{3,4}$"}
                valueState={year[0]}
                updateForm={updateForm}
            />
            <div className="files">
                <FileInput name={"musicFile"} label={"Audio file"} accept={"audio/mpeg"} update={updateFiles} />
                <FileInput name={"coverFile"} label={"Cover image"} accept={"image/jpeg"} update={updateFiles} />
            </div>
            <button type="submit" className="btn-cta">Add music</button>
        </form>
    )
}
