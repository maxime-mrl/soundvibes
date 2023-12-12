import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Playlist } from "../../components";
import { getRecommendations } from "../../features/recommendations/recommendationsSlice";
import "./Home.css";

export default function Home() {
    const { recommendations } = useSelector(state => state.recommendations);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!recommendations || !recommendations[0]) dispatch(getRecommendations())
    // eslint-disable-next-line
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
