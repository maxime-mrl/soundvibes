import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Playlist } from "../../components";
import { getRecommendations } from "../../features/playlists/playlistsSlice";
import "./Home.css";

export default function Home() {
    const { recommendations } = useSelector(state => state.playlists);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!recommendations || !recommendations[0]) dispatch(getRecommendations())

    }, [])
    return (
        <section className="home">
            <h1 className="h1">Hello {user.username}, happy to see you!</h1>
            {recommendations && recommendations.length > 0 &&
                <article className="daily-mix">
                    <h2 className="h2">Here are some mix just for you:</h2>
                    <div className="list">
                        {recommendations.map((playlist, i) => (
                            <Playlist key={i} playlist={playlist} role={"recommendation"} />
                        ))}
                    </div>
                </article>
            }
            <Loader />
        </section>
    )
}
