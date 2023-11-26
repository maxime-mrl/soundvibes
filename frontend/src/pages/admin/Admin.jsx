import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset as resetMusic } from "../../features/musics/musicsSlice";
import { reset as resetUser } from "../../features/auth/authSlice";
import { AddMusic, DeleteMusic, SetRight } from "../../containers";
import { Loader } from "../../components";
import "./Admin.css";

export default function Admin() {
    const { isError, isSuccess, message } = useSelector(state => state.musics)
    const { user, isError:isUserError, isSuccess:isUserSuccess, message:userMessage } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user || !user.right || user.right < 1) navigate("/");
        if (isUserError) {
            dispatch(resetUser());
            toast.error(userMessage);
        }
        if (isUserSuccess && userMessage) {
            dispatch(resetUser());
            toast.success(userMessage);
        }
    }, [user, isUserError, isUserSuccess, userMessage, navigate, dispatch])

    useEffect(() => {
        if (isError) {
            dispatch(resetMusic());
            toast.error(message);
        }
        if (isSuccess && message) {
            dispatch(resetMusic());
            toast.success(message);
        }
    }, [isSuccess, isError, message, dispatch])

    return (
        <>
            <header className="admin-header">
                <h1 className="h1">Hello {user.username}!</h1>
                <h2 className="h2">Manage:</h2>
            </header>
            <section className="admin-actions">
                <AddMusic />
                <SetRight />
                <DeleteMusic />
            </section>
            <Loader />
        </>
    )
}
