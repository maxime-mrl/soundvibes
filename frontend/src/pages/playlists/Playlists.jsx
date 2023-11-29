import { Loader } from "../../components";
import { UserHistory, UserPlaylist } from "../../containers";
import "./Playlists.css";

export default function Playlists() {
    return (
        <>
            <header className="playlists-header">
                <h1 className="h1">Your musics:</h1>
            </header>
            <section className="playlists-page">
                <UserHistory />
                <UserPlaylist />
                <Loader />
            </section>
        </>
    )
}
