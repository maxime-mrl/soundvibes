import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function useMusic() {
    const localMusic = JSON.parse(localStorage.getItem("music"));
    const { user } = useSelector(state => state.auth);
    const interval = useRef();
    const [music, setMusic] = useState({
        audio: null,
        id: localMusic ? localMusic.id : null,
        progress: localMusic ? localMusic.progress : 0,
        duration: localMusic ? localMusic.duration : null,
        title: localMusic ? localMusic.title : "",
        artist: localMusic ? localMusic.artist : "",
        volume: localMusic ? localMusic.volume : 100,
        isPlaying: false // always false regardless of localstorage to start of false and avoid no interaction browser error
    });

    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        if (music.audio && music.volume) music.audio.volume = music.volume/100;
        localStorage.setItem("music", JSON.stringify(music));
    }, [ music ]);

    /* -------------------------- UPDATE PLAYING STATUS ------------------------- */
    useEffect(() => {
        if (music.audio) {
            if (music.isPlaying) {
                music.audio.play();
                interval.current = setInterval(() => updateMusic({progress: music.audio.currentTime}), 100);
            }
            else {
                music.audio.pause();
                clearInterval(interval.current);
            };
        } else if (!music.id) {
            updateMusic({ isPlaying: false });
        }
        return () => {
            clearInterval(interval.current);
        }
    }, [ music.isPlaying, music.id, music.audio ])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        if (!music.id) return;
        updateMusic({ audio: null });
        // get user and set his cookie
        if (user && user.token) document.cookie = `token=${user.token}; SameSite=None; Secure`;
        else return toast.error("User not found!");
        // get audio
        const audio = new Audio(`http://localhost/api/music/play/${music.id}`); // throw a warning don't know why
        // listen for errors
        audio.addEventListener("error", () => toast.error("Error while loading audio, please try again later."));
        // handle everything on load (get the length, set the volume etc)
        audio.addEventListener("loadedmetadata", () => {
            console.log(audio)
            audio.currentTime = music.progress;
            audio.volume = music.volume ? music.volume/100 : 1;
            updateMusic({
                audio,
                duration: audio.duration,
            });
            if (music.isPlaying) {
                audio.play()
                interval.current = setInterval(() => {
                    updateMusic({progress: audio.currentTime})
                }, 100);
            }
        })
        // cleanup
        return () => {
            updateMusic({ audio: null });
        };
    // eslint-disable-next-line
    }, [ music.id ]);

    function updateMusic(update) {
        setMusic(prevState => ({
            ...prevState,
            ...update
        }));
    }

    function reset() {
        if (music.audio) {
            music.audio.pause();
            clearInterval(interval.current)
        }
        updateMusic({
            audio: null,
            id: null,
            progress: 0,
            duration: null,
            title: "",
            artist: "",
            isPlaying: false // always false regardless of localstorage
        })
    }

    return [music, setMusic, reset];
}
