import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, reset } from "../../features/auth/authSlice";
import { TextInput } from "../../components"
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

    const [{ mail, password }, setFormData] = useState({
        username: ["", false],
        mail: ["", false],
        password: ["", false],
        confirm_password: ["", false],
        age: ["", false]
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
    
    function submitForm(e) {
        e.preventDefault();
        if (!mail[1] || !password[1]) {
            toast.error("Please fill and validate all inputs!");
            return;
        }
        const userData = { mail: mail[0], password: password[0] };
        dispatch(login(userData));
    }

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success(`Welcome back ${user.username}!`);
            navigate("/");
        }
        if (user) {
            navigate("/");
        }
        dispatch(reset())
    }, [user, isSuccess, isError, message, navigate, dispatch])
    return (
        <>
            <section className="login-header">
                <h1 className="h1">Soundvibes</h1>
                <h2 className="h2">Login</h2>
            </section>
            <form onSubmit={submitForm} className="login-form">
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
                <button type="submit" className="btn-cta">Sign in</button>
                <div className="register-redirect">
                    Don't have an account? <Link to={"/register"}>Sign up</Link>
                </div>
            </form>
        </>
    )
}
