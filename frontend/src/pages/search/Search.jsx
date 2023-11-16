import { SearchBar } from "../../components";
import { SongList } from "../../containers";
import { useEffect } from "react";
import { reset } from "../../features/musics/musicsSlice";
import "./Search.css";
import { useDispatch, useSelector } from "react-redux";

export default function Search() {
    const dispatch = useDispatch()
    const { musics } = useSelector(state => state.musics);
    console.log(musics)
    useEffect(() => {
        return () => dispatch(reset())
    }, [])
    return (
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
            <h2 className="h2">Search something</h2>
            }
        </section>
    )
}
