import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistory } from "../../features/auth/authSlice";
import { Loader, SearchBar } from "../../components";
import { SongList } from "../../containers";
import "./Search.css";

export default function Search() {
    const dispatch = useDispatch();
    const { musics } = useSelector(state => state.musics);
    const { history } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getHistory());
    }, [dispatch])

    return (
        <>
            <section className="search">
                <SearchBar />
                {musics && musics.length > 0
                ? 
                    (!musics[0]._id 
                    ?
                    <>
                        <h2 className="h2">No musics found with this query</h2>
                        <p>Check the spelling or try something else...</p>
                    </>
                    :
                    <SongList musics={musics} />
                    )
                :
                <>
                    <Loader />
                    <div className="history">
                        <h2 className="h2">Recently listened</h2>
                        <SongList musics={history} />
                    </div>
                </>
                }
            </section>
        </>
    )
}
