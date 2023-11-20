import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function useMusic() {
    const localMusic = JSON.parse(localStorage.getItem("music"));
    // if ('mediaSession' in navigator && navigator.mediaSession.playbackState) localMusic.progress = navigator.mediaSession.playbackState.progress
    const { user } = useSelector(state => state.auth);
    const interval = useRef();
    const [music, setMusic] = useState({
        audio: null,
        id: localMusic ? localMusic.id : null,
        progress: localMusic ? localMusic.progress : 0,
        duration: null,
        title: localMusic ? localMusic.title : "",
        artist: localMusic ? localMusic.artist : "",
        volume: localMusic ? localMusic.volume : 100,
        isLoading: true,
        autoPlay: false,
        isPlaying: false // always false regardless of localstorage to start of false and avoid no interaction browser error
    });
    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        if (music.audio && music.volume) music.audio.volume = music.volume/100;
        localStorage.setItem("music", JSON.stringify(music));
        if ('mediaSession' in navigator && music.audio && music.audio.currentTime) navigator.mediaSession.setPositionState({
            duration: music.duration,
            playbackRate: 1,
            position: music.progress,
        });
    }, [ music ]);

    /* -------------------------- UPDATE PLAYING STATUS ------------------------- */
    useEffect(() => {
        if (music.audio && !music.isLoading) {
            if (music.isPlaying) {
                music.audio.play()
                .catch(err => {
                    alert(err)
                });
                interval.current = setInterval(() => {
                    updateMusic({progress: music.audio.currentTime})
                    // let formData = new FormData();
                    // formData.append('progressmemory', music.progress);
                    // formData.append('progressreal', music.audio.currentTime);
                    // fetch("http://192.168.1.100/console", {
                    //     method: "POST",
                    //     body: formData
                    // })
                }, 100);
            }
            else {
                music.audio.pause();
                music.audio.currentTime = music.progress;
                clearInterval(interval.current);
            };
        } else if (!music.id || music.isLoading) {
            updateMusic({ isPlaying: false });
        }
        return () => {
            clearInterval(interval.current);
        }
    }, [ music.isPlaying, music.id, music.audio ])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        if (!music.id) return;
        if (music.audio) {
            clearInterval(interval.current);
            music.audio.pause();
        }
        updateMusic({ audio: null });
        // check user
        if (!user || !user.token) return toast.error("User not found!");
        // get audio
        fetch(`http://192.168.1.100/api/music/play/${music.id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => { // https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
            const reader = response.body.getReader();
            return new ReadableStream({ start(controller) {
                const pump = () => reader.read().then(({ done, value }) => {
                    // When no more data needs to be consumed, close the sstream
                    if (done) return controller.close();
                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                    return pump();
                });
                return pump();
            }, });
        })
        // Create an object URL for the response
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        // use the audio
        .then((url) => {
            const audio = document.querySelector("audio") ? document.querySelector("audio") : document.createElement("audio");
            const source = document.createElement("source");
            audio.preload = "auto"; source.src = url; source.type = "audio/mpeg";
            audio.title = music.title; audio.subtitle = music.artist;
            audio.appendChild(source);
            document.body.appendChild(audio);
            audio.addEventListener("loadedmetadata",() => {
                addmetadata(audio);
                audio.volume = music.volume ? music.volume/100 : 1;
                audio.currentTime = music.progress;
                updateMusic({
                    audio: audio,
                    duration: audio.duration,
                    isLoading: false,
                });
                if (music.autoPlay) {
                    updateMusic({
                        autoPlay: false,
                        isPlaying: true
                    })
                }
            })
        });
        // cleanup
        return () => {
            document.querySelectorAll("audio").forEach(audio => audio.remove())
            updateMusic({ audio: null });
        };
    // eslint-disable-next-line
    }, [ music.id ]);


    function addmetadata(audio) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
            title: music.title,
            artist: music.artist,
            album: 'Album Name',
            artwork: [
                { src: `http://192.168.1.100:80/public/${music.id}/cover.jpg` },
            ],
            });
            navigator.mediaSession.setPositionState({
                duration: audio.duration,
                position: audio.currentTime,
                playbackRate: 1,
            });
            let formData = new FormData();
            formData.append('musicduration', audio.duration);
            formData.append('progress', music.progress);
            fetch("http://192.168.1.100/console", {
                method: "POST",
                body: formData
                
            })
        }
        audio.addEventListener('play', () => {
            // Custom logic when the audio starts playing
            if ('mediaSession' in navigator && navigator.mediaSession.setActionHandler) {
              navigator.mediaSession.setActionHandler('play', () => updateMusic({isPlaying: true}));
              navigator.mediaSession.setActionHandler('pause', () => updateMusic({isPlaying: false}));
              navigator.mediaSession.setActionHandler("seekto", (e) => {
                audio.currentTime = e.seekTime;
              })
            }
        });
    }

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
            isLoading: true,
            autoPlay: false,
            isPlaying: false // always false regardless of localstorage
        })
        document.querySelectorAll("audio").forEach(audio => audio.remove())
        console.log("reset")
    }

    return [music, setMusic, reset];
}
