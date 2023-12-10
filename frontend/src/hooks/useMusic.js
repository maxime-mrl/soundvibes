import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function useMusic() {
    const getAudio = () =>  {
        if (document.querySelector(".audio-player")) return document.querySelector(".audio-player");
        else {
            if (music && music.id) resetState();
            return new Audio();
        };
    };
    const initialState = JSON.parse(localStorage.getItem("music")) ? JSON.parse(localStorage.getItem("music")) : {};
    if (!initialState.ids) initialState.ids = [];
    if (!initialState.pos) initialState.pos = 0;
    if (!initialState.id) initialState.id = null;
    if (!initialState.progress) initialState.progress = 0;
    if (!initialState.title) initialState.title = "";
    if (!initialState.artist) initialState.artist = "";
    if (!initialState.volume) initialState.volume = 100;
    if (!initialState.mode) initialState.mode = false;

    const { user } = useSelector(state => state.auth);
    const [music, setMusic] = useState({
        ids: initialState.ids,
        pos: initialState.pos,
        id: initialState.id,
        progress: initialState.progress,
        title: initialState.title,
        artist: initialState.artist,
        volume: initialState.volume,
        mode: initialState.mode,
        audio: null,
        duration: null,
        isLoading: true,
        autoPlay: false,
        isPlaying: false,
        prevLoading: false,
        nextLoading: false,
        ended: false,
    });
    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        const audio = getAudio();
        // update volume
        if (music.audio && music.volume) audio.volume = music.volume/100;
        // update local storage
        const toSave = {
            ids: music.ids,
            pos: music.pos,
            id: music.id,
            progress: music.progress,
            title: music.title,
            artist: music.artist,
            volume: music.volume,
            mode: music.mode,
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
    
    /* ---------------------- HANDLE PREV / NEXT / END SONG --------------------- */
    useEffect(() => {
        if (music.nextLoading) {
            updateMusic({nextLoading: false});
            if ((music.ids.length > 1 && (music.pos + 1 < music.ids.length || music.mode === "shuffle")) || music.mode === "loop") {
                let pos = music.pos + 1;
                if (music.mode === "shuffle") pos = getRandomPos();
                if (music.mode === "loop") {
                    if (music.ids.length === 1) pos = music.pos;
                    else if (pos >= music.ids.length) pos = 0;
                }
                playNewMusic({ ids: music.ids, pos });
            } else if (music.progress + 2 > music.duration) {
                updateMusic({ isPlaying: false });
            }
        }
        else if (music.prevLoading) {
            updateMusic({prevLoading: false});
            if (music.progress > 10 || music.pos === 0) getAudio().currentTime = 0;
            else playNewMusic({ ids: music.ids, pos: music.pos - 1 });
        }
        else if (music.ended) {
            updateMusic({
                nextLoading: true,
                ended: false
            });
        }
        function getRandomPos() {
            let pos = Math.floor(Math.random() * music.ids.length);
            if (pos === music.pos) return getRandomPos();
            return pos;
        }
    }, [music.nextLoading, music.ended, music.prevLoading])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        // check needed (user and id)
        if (!music.id || !music.id) return; // need a music ID
        if (!user || !user.token) return toast.error("User not found!");
        // get audio (adapted from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
        fetch(`http://${window.location.hostname}:80/api/musics/play/${music.id}`, {
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

    function addMetadata() { // metadata are everything that let the system know what audio is (to have music notification on mobile etc)
        const audio = getAudio();
        if (music.progress + 10 > audio.duration) audio.currentTime = 0;
        else audio.currentTime = music.progress;
        if (('mediaSession' in navigator)) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: music.title,
                artist: music.artist,
                artwork: [ { src: `http://${window.location.hostname}:80/public/${music.id}/cover.jpg` } ]
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
        audio.onended = () => updateMusic({ ended: true });
    }

    function updateMusic(update) { // update the music
        setMusic(prevState => ({
            ...prevState,
            ...update
        }));
    }

    async function playNewMusic({ ids, pos }) {
        if (!pos) pos = 0;
        if (ids.length === 1 && ids[0] === music.id && music.mode !== "loop") return; // do nothing if one music is the same as actual
        if (!user || !user.token) return toast.error("User not found!");
        reset();
        const resp = await fetch(`http://${window.location.hostname}:80/api/musics/get/${ids[pos]}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        const infos = await resp.json();
        if (!infos || !infos.artist || !infos.title) return toast.error("infos not found");
        updateMusic({
            ids,
            pos,
            id: ids[pos],
            autoPlay: true,
            title: infos.title,
            artist: infos.artist,
        })
    }

    function reset() { // reset to default stage
        handlePause();
        let audio = getAudio();
        audio.onended = null;
        audio.onloadedmetadata = null;
        audio.ontimeupdate = null;
        audio.currentTime = 0;
        resetState()
    }
    function resetState() {
        updateMusic({
            ids: [],
            pos: 0,
            id: null,
            progress: 0,
            title: "",
            artist: "",
            audio: null,
            duration: null,
            isLoading: true,
            autoPlay: false,
            isPlaying: false,
            prevLoading: false,
            nextLoading: false,
            ended: false,
            // volume: 100,
            // mode: false,
        })
    }


    return [music, updateMusic, reset, playNewMusic];
}
