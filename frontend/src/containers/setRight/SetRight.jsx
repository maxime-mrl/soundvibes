import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setRight } from "../../features/auth/authSlice";
import { TextInput } from "../../components";
import "./SetRight.css";

export default function SetRight() {
    const dispatch = useDispatch()

    const [userToUpdate, setUserToUpdate] = useState("");
    const [rightToUpdate, setrightToUpdate] = useState(0);

    function updateBtn(right) {
        setrightToUpdate(right);
        const btns = document.querySelector(".right-form .btns");
        btns.querySelector(".btn-success").classList.remove("btn-success");
        btns.querySelector(`*:nth-child(${right + 1})`).classList.add("btn-success");
    }

    function submitForm(e) {
        e.preventDefault();
        if (!userToUpdate) return toast.error("Please add an user to update!");
        const data = {
            right: rightToUpdate,
            target: userToUpdate
        };
        
        setUserToUpdate("");
        setrightToUpdate("");
        dispatch(setRight(data));
    }
    
    return (
        <>
            <form className="right-form" onSubmit={submitForm}>
                <h3 className="h2">Set user right:</h3>
                <TextInput 
                    label={{
                        regular: "User",
                    }}
                    input={{
                        name: "userToUpdate",
                        placeholder: "User identifier (mail, username, or id)",
                        autoComplete: "off",
                    }}
                    valueState={userToUpdate}
                    updateForm={(e) => setUserToUpdate(e.target.value)}
                />
                <div className="btns">
                    <button type="button" className="btn-cta btn-white btn-success" onClick={() => updateBtn(0)} >Regular</button>
                    <button type="button" className="btn-cta btn-white" onClick={() => updateBtn(1)} >Manage musics</button>
                    <button type="button" className="btn-cta btn-white" onClick={() => updateBtn(2)}>Super admin</button>
                </div>
                <button type="submit" className="btn-cta">Update right</button>
            </form>
        </>
    )
}
