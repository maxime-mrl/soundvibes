import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddMusic, DeleteMusic, SetRight } from "../../containers";
import { Loader } from "../../components";
import "./Admin.css";

export default function Admin() {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.right || user.right < 1) navigate("/");
    }, [user, navigate])


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
