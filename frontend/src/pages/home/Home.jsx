import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Playlist } from "../../components";
import { getRecommendations, getTrending } from "../../features/recommendationsSlice";
import "./Home.css";

export default function Home() {
    const { recommendations, topListened } = useSelector(state => state.recommendations);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!recommendations || !recommendations[0]) dispatch(getRecommendations());
        if (!topListened || !topListened[0]) dispatch(getTrending());
    // eslint-disable-next-line
    }, [])

    return (
        <section className="home">
            <h1 className="h1">Hello {user.username}, happy to see you!</h1>
            {recommendations && recommendations.length > 0 &&
                <article className="daily home-mix">
                    <h2 className="h2">Here are some mix just for you:</h2>
                    <div className="list">
                        {recommendations.map((playlist, i) => (
                            <Playlist key={i} playlist={playlist} role={"recommendation"} />
                        ))}
                    </div>
                </article>
            }
            {topListened && topListened.length > 0 &&
                <article className="toplistened home-mix">
                    <h2 className="h2">Here are some playlist based on the most listened audio:</h2>
                    <div className="list">
                        {topListened.map((playlist, i) => (
                            <Playlist key={i} playlist={playlist} role={"recommendation"} />
                        ))}
                    </div>
                </article>
            }
            <Loader />
        </section>
    )
}
