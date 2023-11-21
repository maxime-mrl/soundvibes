import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function useMusic() {
    const localMusic = JSON.parse(localStorage.getItem("music"));
    const { user } = useSelector(state => state.auth);
    const [music, setMusic] = useState({
        id: localMusic ? localMusic.id : null,
        progress: localMusic ? localMusic.progress : 0,
        title: localMusic ? localMusic.title : "",
        artist: localMusic ? localMusic.artist : "",
        volume: localMusic ? localMusic.volume : 100,
        audio: null,
        duration: null,
        isLoading: true,
        autoPlay: false,
        isPlaying: false,
    });
    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        // update volume
        if (music.audio && music.volume) music.audio.volume = music.volume/100;
        // update local storage
        localStorage.setItem("music", JSON.stringify(music));
        // update media session
        if ('mediaSession' in navigator && music.duration) navigator.mediaSession.setPositionState({
            playbackRate: 1,
            position: music.progress >= music.duration ? 0 : music.progress,
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
    }, [ music.isPlaying, music.isLoading ])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        if (!music.id) return; // need a music ID
        // reset the music
        handlePause();
        updateMusic({ audio: null });
        // check user
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
        // use the audio
        .then((url) => {
            // set up the audio
            const audio = document.querySelector("audio") ? document.querySelector("audio") : document.createElement("audio");
            const source = audio.querySelector("source") ? audio.querySelector("source") : document.createElement("source");
            audio.appendChild(source); document.body.appendChild(audio);
            source.src = url; source.type = "audio/mpeg";
            // wait for load (loadedmetadata and not loaded because loaded won't fire in IOS)
            audio.onloadedmetadata = () => {
                audio.onloadedmetadata = null;
                if (music.progress >= audio.duration) {
                    updateMusic({progress: 0})
                    audio.currentTime = 0;
                }
                else audio.currentTime = music.progress;
                addMetadata(audio);
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
            }
        });
        // cleanup
        return () => {
            document.querySelectorAll("audio").forEach(audio => audio.remove())
            updateMusic({ audio: null });
        };
    // eslint-disable-next-line
    }, [ music.id ]);

    function handlePlay() { // play the music
        if (!music.audio) return;
        music.audio.play()
        .then(() => music.audio.currentTime = music.progress)
        .catch(err => {
            // window.location.reload();
            updateMusic({isPlaying: false})
            toast.error(`Something weent wrong :/ Please try again.`);
            console.error(err);
        });
    }

    function handlePause() { // pause the music
        if (!music.audio) return;
        music.audio.pause();
        music.audio.currentTime = music.progress;
    }


    function addMetadata(audio) { // metadata are everything that let the system know what audio is (to have music notification on mobile etc)
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: music.title,
            artist: music.artist,
            artwork: [ { src: `http://${window.location.hostname}:80/public/${music.id}/cover.jpg` } ]
        });
        navigator.mediaSession.setActionHandler('play', () => updateMusic({ isPlaying: true }));
        navigator.mediaSession.setActionHandler('pause', () => updateMusic({ isPlaying: false }));
        navigator.mediaSession.setActionHandler("seekto", (e) => audio.currentTime = e.seekTime);
    }

    function updateMusic(update) { // update the music
        setMusic(prevState => ({
            ...prevState,
            ...update
        }));
    }

    function reset() { // reset to default stage
        handlePause();
        if (music.audio) music.audio.ontimeupdate = null;
        updateMusic({
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
        })
        document.querySelectorAll("audio").forEach(audio => audio.remove());
    }

    return [music, setMusic, reset];
}
