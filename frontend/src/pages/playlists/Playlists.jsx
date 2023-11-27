import { Loader } from "../../components";
import { UserHistory } from "../../containers";
import "./Playlists.css";

export default function Playlists() {
    return (
        <>
            <UserHistory />
            <h1 className="h1">Playlists:</h1>
            <Loader />
        </>
    )
}
