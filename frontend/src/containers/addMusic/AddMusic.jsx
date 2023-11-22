import { useEffect, useState } from "react";
import { TextInput } from "../../components";
import "./AddMusic.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMusic, reset } from "../../features/musics/musicsSlice";

export default function AddMusic() {
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector(state => state.musics)

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
    
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess && message) {
            toast.success(message);
        }
        dispatch(reset());
    }, [isSuccess, isError, message])

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
        e.preventDefault()
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
    }

    return (
        <form onSubmit={submitForm} className="add-music">
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
                validation={"^[-a-z0-9\\s]+$"}
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
                validation={"^[-a-z0-9\\s]+$"}
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
            <div className="file-input-container">
                <label htmlFor="musicFile" className="file-label">
                    Audio file:
                </label>
                <input
                    className="file-input"
                    type="file"
                    accept="audio/mpeg"
                    name="musicFile"
                    id="musicFile"
                    onChange={updateFiles}
                />
            </div>
            <div className="file-input-container">
                <label htmlFor="coverFile" className="file-label">
                    Cover image:
                </label>
                <input
                    className="file-input"
                    type="file"
                    accept="image/jpeg"
                    name="coverFile"
                    id="coverFile"
                    onChange={updateFiles}
                />
            </div>
            <button type="submit" className="btn-cta">Add music</button>
        </form>
    )
}
