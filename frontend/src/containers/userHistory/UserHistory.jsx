import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistory } from "../../features/auth/authSlice";
import { SongList } from "../";
import "./UserHistory.css";

export default function UserHistory() {
    const dispatch = useDispatch();
    const { history } = useSelector(state => state.auth);
    useEffect(() => {
        console.log(history)
        if (!history || history.length === 0) {
            console.log("getHistory");
            dispatch(getHistory());
        }
    }, [history, dispatch])
    return (
        <section className="user-history">
            <h2 className="h2">Your history:</h2>
            {history && history.length > 0 && history[0]._id 
            ? 
                <SongList musics={history} />
            :
            <>
                <h2 className="h2">Your have not listened to anything yet</h2>
                <p>Go to home page to find recommendations</p>
            </>
            }
        </section>
    )
}
