import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddMusic } from "../../containers";
import "./Admin.css";

export default function Admin() {
    const { user, isLoading } = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !isLoading) navigate("/");
        else if (!user.right || user.right < 1) navigate("/");
    }, [user, isLoading])
    return (
        <>
            <header className="admin-header">
                <h1 className="h1">Hello {user.username}!</h1>
                <h2 className="h2">Manage:</h2>
            </header>
            <AddMusic />
        </>
    )
}
