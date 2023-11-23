import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";
import { Loader, TextInput } from "../../components";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

    const [{ username, mail, password, confirm_password, age }, setFormData] = useState({
        username: ["", false],
        mail: ["", false],
        password: ["", false],
        confirm_password: ["", false],
        age: ["", false]
    });

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            navigate("/")
            toast.success(`Welcome ${user.username}!`)
        }
        if (user) {
            navigate("/")
        }
        dispatch(reset())
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
        if (!username[1] || !mail[1] || !password[1] || !confirm_password[1] || !age[1]) {
            toast.error("Please fill and validate all inputs!");
            return;
        }
        const userData = { username: username[0], mail: mail[0], password: password[0], age: age[0] };
        dispatch(register(userData));
    }
    return (
        <>
            <section className="register-header">
                <h1 className="h1">Soundvibes</h1>
                <h2 className="h2">Join the comunity</h2>
            </section>
            <form onSubmit={submitForm} className="register-form">
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
                        regular: "Password:",
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
                        regular: "Confirm password:",
                        error: "Your passwords dosen't match"
                    }}
                    input={{
                        name: "confirm_password",
                        placeholder: "Your password",
                        type: "password"
                    }}
                    validation={"&=password"}
                    valueState={confirm_password[0]}
                    updateForm={updateForm}
                />
                <TextInput 
                    label={{
                        regular: "Age:",
                        error: "You need to be at least 13 to use this website"
                    }}
                    input={{
                        name: "age",
                        placeholder: "Your age",
                        type: "number"
                    }}
                    validation={"^([2-9][0-9])$|^(1[3-9])$"}
                    valueState={age[0]}
                    updateForm={updateForm}
                />
                <button type="submit" className="btn-cta">Sign up</button>
                <div className="login-redirect">
                    Arleady have an account? <Link to={"/login"}>Login</Link>
                </div>
            </form>
            <Loader />
        </>
    )
}
