import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset } from "../../features/musics/musicsSlice";
import { AddMusic, DeleteMusic } from "../../containers";
import { Loader } from "../../components";
import "./Admin.css";

export default function Admin() {
    const { isError, isSuccess, message } = useSelector(state => state.musics)
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!user || !user.right || user.right < 1) navigate("/");
    }, [user, navigate])

    
    useEffect(() => {
        if (isError) {
            dispatch(reset());
            toast.error(message);
        }
        if (isSuccess && message) {
            dispatch(reset());
            toast.success(message);
        }
    }, [isSuccess, isError, message, dispatch])

    return (
        <>
            <header className="admin-header">
                <h1 className="h1">Hello {user.username}!</h1>
                <h2 className="h2">Manage:</h2>
            </header>
            <AddMusic />
            <DeleteMusic />
            <Loader />
        </>
    )
}
