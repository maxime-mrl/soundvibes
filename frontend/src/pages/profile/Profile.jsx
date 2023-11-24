import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { infos, reset, updateProfile, logout } from "../../features/auth/authSlice";
import { Loader, TextInput } from "../../components";
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, isError, message } = useSelector(state => state.auth);

    const [{ username, mail, password, confirm_password }, setFormData] = useState({
        username: ["", false],
        mail: ["", false],
        password: ["", false],
        confirm_password: ["", false],
    });

    useEffect(() => {
        if (isError) toast.error(message);
        else dispatch(reset());
        
        if (!user || !user.token) navigate("/");
        else if (isSuccess) toast.success(`Information successfully updated`);
        if (user && !user.mail) dispatch(infos());
        else if (user && user.mail) setFormData(prevState => ({
            ...prevState,
            username: [user.username, true],
            mail: [user.mail, true],
        }));
    }, [user, isSuccess, isError, message, navigate, dispatch])

    
    function updateForm(e) {
        let isValidated = false;
        const value = e.target.value;
        const validateQuery = e.target.getAttribute("data-validate");
        /* ----------------------------- validate inputs ---------------------------- */
        if (!/^&=/.test(validateQuery)) { // normal regex
            const regex = new RegExp(validateQuery, "i");
            if (regex.test(value)) isValidated = true;
        // match other element (confirm password)
        } else if (document.getElementById(validateQuery.replace("&=", "")).value === value) isValidated = true;
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

    function submitForm(e) {
        e.preventDefault()
        if (!confirm_password[1]) {
            toast.error("You need to confirm your actual password!");
            return;
        }
        const userData = {
            confirmPassword: confirm_password[0]
        };
        if (username[0].length > 0) userData.username = username[0];
        if (mail[0].length > 0) userData.mail = mail[0];
        if (password[0].length > 0) userData.password = password[0];
        dispatch(updateProfile(userData));
    }

    function signOut() {
        toast.success("successfully signed out!");
        dispatch(logout());
    }

    if (!user) return (<></>)

    return (
        <>
            <section className="profile">
                <header className="profile-header">
                    <h1 className="h1">Hello {user.username}!</h1>
                    <h2 className="h2">Your profile:</h2>
                </header>
                <form onSubmit={submitForm} className="profile-form">
                    <TextInput 
                        label={{
                            regular: "Username:",
                            error: "Invalid username, allowed: a-z, 0-9 and -"
                        }}
                        input={{
                            name: "username",
                            placeholder: "Your username",
                            autoComplete: "username",
                        }}
                        validation={"^[-a-z0-9]{2,}$"}
                        valueState={username[0]}
                        updateForm={updateForm}
                    />
                    <TextInput 
                        label={{
                            regular: "Email:",
                            error: "Invalid email"
                        }}
                        input={{
                            name: "mail",
                            placeholder: "Your email",
                            autoComplete: "email",
                            type: "email"
                        }}
                        validation={"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"}
                        valueState={mail[0]}
                        updateForm={updateForm}
                    />
                    <TextInput 
                        label={{
                            regular: "New password:",
                            error: "Your password must be at least 6 character"
                        }}
                        input={{
                            name: "password",
                            placeholder: "Your password",
                            type: "password"
                        }}
                        validation={"^.{6,}$"}
                        valueState={password[0]}
                        updateForm={updateForm}
                    />
                    <TextInput 
                        label={{
                            regular: "Actual password:",
                            error: "Your password must be at least 6 character"
                        }}
                        input={{
                            name: "confirm_password",
                            placeholder: "Your old password",
                            type: "password"
                        }}
                        validation={"^.{6,}$"}
                        valueState={confirm_password[0]}
                        updateForm={updateForm}
                    />
                    <div className="btns">
                        <button type="submit" className="btn-cta">Update Profile</button>
                        <button type="button" onClick={signOut} className="btn-cta btn-fail">Sign out</button>
                    </div>
                    {user && user.right && user.right > 0 ?
                    <div>
                        <Link to="/admin" className="btn-cta admin-btn">Manage Musics</Link>
                    </div>
                    :
                    ""
                    }
                </form>
            </section>
            <Loader />
        </>
    )
}
