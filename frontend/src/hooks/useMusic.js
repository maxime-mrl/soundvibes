import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getHistory } from "../features/auth/authSlice";

export default function useMusic() {
    const dispatch = useDispatch();
    const getAudio = () =>  {
        if (document.querySelector(".audio-player")) return document.querySelector(".audio-player");
        else return new Audio();
    };
    const localMusic = JSON.parse(localStorage.getItem("music"));
    const { user, history } = useSelector(state => state.auth);
    const [music, setMusic] = useState({
        ids: localMusic ? localMusic.ids : [],
        id: localMusic ? localMusic.ids[0] : null,
        progress: localMusic ? localMusic.progress : 0,
        title: localMusic ? localMusic.title : "",
        artist: localMusic ? localMusic.artist : "",
        volume: localMusic ? localMusic.volume : 100,
        audio: null,
        duration: null,
        isLoading: true,
        autoPlay: false,
        isPlaying: false,
        prevLoading: false,
        nextLoading: false,
    });
    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        const audio = getAudio();
        // update volume
        if (music.audio && music.volume) audio.volume = music.volume/100;
        // update local storage
        const toSave = {
            ids: music.ids,
            id: music.id,
            progress: music.progress,
            title: music.title,
            artist: music.artist,
            volume: music.volume,
        };
        localStorage.setItem("music", JSON.stringify(toSave));
        // update media session
        if ('mediaSession' in navigator) navigator.mediaSession.setPositionState({
            playbackRate: 1,
            position: audio.currentTime,
            duration: music.duration,
        });
    }, [ music ]);

    /* -------------------------- UPDATE PLAYING STATUS ------------------------- */
    useEffect(() => {
        // music loaded -> handle play/pause
        if (!music.isLoading) music.isPlaying ? handlePlay() : handlePause();
        // music not yet loaded -> force paused state
        else updateMusic({ isPlaying: false });
        // cleanup
        return () => { handlePause() }
    // eslint-disable-next-line
    }, [ music.isPlaying, music.isLoading ])
    
    /* ------------------------ HANDLE PREV AND NEXT SONG ----------------------- */
    useEffect(() => { // prev
        if (!music.prevLoading) return;
        if (music.progress > 10) {
            updateMusic({
                prevLoading: false,
            })
            return getAudio().currentTime = 0
        }
        if (!history || history.length < 1) dispatch(getHistory());
        else { // will change
            const newlist = music.ids;
            console.log(newlist)
            let pos = 1; 
            while (newlist[0] === history[pos]._id && pos < 10) pos++;
            
            newlist.unshift(history[pos]._id);
            console.log(newlist)
            playNewMusic({ids: newlist});
        }
        console.log(history)

    }, [music.prevLoading, history])
    
    useEffect(() => { // next
        if (music.ids.length > 1 && music.nextLoading) {
            const newList = music.ids;
            newList.shift();
            playNewMusic({ ids: newList });
        }
    }, [music.nextLoading])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        // check needed (user and id)
        if (!music.ids || !music.ids[0]) return; // need a music ID
        if (!user || !user.token) return toast.error("User not found!");
        // get audio (adapted from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
        fetch(`http://${window.location.hostname}:80/api/musics/play/${music.ids[0]}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => { // read the whole stream
            const reader = response.body.getReader();
            return new ReadableStream({ start(controller) {
                const pump = () => reader.read().then(({ done, value }) => {
                    if (done) return controller.close(); // When no more data needs to be consumed, close the sstream
                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                    return pump();
                });
                return pump();
            }, });
        })
        .then(async (stream) => { // Create an object URL for the response
            const blob = await new Response(stream).blob();
            return URL.createObjectURL(blob);
        })
        .then((url) => { // use the audio
            const audio = getAudio();
            // set up the audio
            audio.querySelector("source").src = url;
            audio.load();
            // wait for load (loadedmetadata and not loaded because loaded won't fire in IOS)
            audio.onloadedmetadata = () => {
                audio.onloadedmetadata = null;
                addMetadata();
            }
        })
        .catch(err => {
            toast.error(err.message);
            reset();
        })
    // eslint-disable-next-line
    }, [ music.ids ]);

    function handlePlay() { // play the music
        const audio = getAudio();
        audio.play()
        .catch(err => {
            updateMusic({ isPlaying: false })
            toast.error(`Something weent wrong :/ Please try again.`);
            console.error(err);
        });
    }

    function handlePause() { // pause the music
        const audio = getAudio();
        audio.pause();
    }

    function handleEnd() {
        if (music.ids.length > 1) {
            const newIds = music.ids;
            newIds.shift();
            playNewMusic({ ids: newIds });
        } else {
            updateMusic({ isPlaying: false })
        }
    }

    function addMetadata() { // metadata are everything that let the system know what audio is (to have music notification on mobile etc)
        const audio = getAudio();
        audio.currentTime = music.progress;
        if (('mediaSession' in navigator)) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: music.title,
                artist: music.artist,
                artwork: [ { src: `http://${window.location.hostname}:80/public/${music.ids[0]}/cover.jpg` } ]
            });
            navigator.mediaSession.setActionHandler('play', () => updateMusic({ isPlaying: true }));
            navigator.mediaSession.setActionHandler('pause', () => updateMusic({ isPlaying: false }));
            navigator.mediaSession.setActionHandler("seekto", (e) => audio.currentTime = e.seekTime);
            navigator.mediaSession.setActionHandler("previoustrack", () => updateMusic({ prevLoading: true }));
            navigator.mediaSession.setActionHandler("nexttrack", () => updateMusic({ nextLoading: true }));
        }
        updateMusic({
            audio: audio,
            duration: audio.duration,
            isLoading: false,
        });
        if (music.autoPlay) updateMusic({
            autoPlay: false,
            isPlaying: true
        });
        audio.ontimeupdate = () => updateMusic({ progress: audio.currentTime });
        audio.onended = handleEnd;
    }

    function updateMusic(update) { // update the music
        setMusic(prevState => ({
            ...prevState,
            ...update
        }));
    }

    async function playNewMusic({ ids }) {
        if (music.ids && music.ids[0] && (ids.length === 1 && ids[0] === music.ids[0])) return; // do nothing if stop musics
        reset();
        if (!user || !user.token) return toast.error("User not found!");
        const resp = await fetch(`http://${window.location.hostname}:80/api/musics/get/${ids[0]}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        const infos = await resp.json();
        if (!infos || !infos.artist || !infos.title) return toast.error("infos not found");
        updateMusic({
            ids,
            id: ids[0],
            autoPlay: true,
            title: infos.title,
            artist: infos.artist,
        })
    }

    function reset() { // reset to default stage
        handlePause();
        let audio = document.querySelector(".audio-player");
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.ontimeupdate = null;
        audio.currentTime = 0;
        updateMusic({
            ids: [],
            id: null,
            progress: 0,
            title: "",
            artist: "",
            // volume: 100,
            audio: null,
            duration: null,
            isLoading: true,
            autoPlay: false,
            isPlaying: false,
            prevLoading: false,
            nextLoading: false,
        })
    }


    return [music, updateMusic, reset, playNewMusic];
}
