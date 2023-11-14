import { useEffect, useState } from "react";

export default function useMusic() {
    const localMusic = JSON.parse(localStorage.getItem("music"));
    let interval;
    const [music, setMusic] = useState({
        audio: null,
        id: localMusic ? localMusic.id : "654540f811486f375a12c5f3",
        progress: localMusic ? localMusic.progress : 0,
        duration: localMusic ? localMusic.duration : null,
        name: localMusic ? localMusic.name : "Do I wanna know",
        artist: localMusic ? localMusic.artist : "Artic monkeys",
        volume: localMusic ? localMusic.volume : 100,
        isPlaying: false // always false regardless of localstorage
    })

    /* ---------------------------- VOLUME + STORAGE ---------------------------- */
    useEffect(() => {
        if (music.audio) music.audio.volume = music.volume/100;
        localStorage.setItem("music", JSON.stringify(music));
    }, [ music ]);

    /* -------------------------- UPDATE PLAYING STATUS ------------------------- */
    useEffect(() => {
        if (music.audio) {
            if (music.isPlaying) {
                music.audio.play();
                interval = setInterval(() => updateMusic({progress: music.audio.currentTime}), 100);
            }
            else {
                music.audio.pause();
                clearInterval(interval)
            };
        }
        return () => {clearInterval(interval)}
    }, [ music.isPlaying ])

    // useEffect(() => {
    //     console.log("audio update")
    // }, [music.audio])

    // useEffect(() => {

    // }, [music.progress])
    
    /* ------------------------------ LOADING AUDIO ----------------------------- */
    useEffect(() => {
        const audio = new Audio(`http://localhost/api/music/play/${music.id}`); // throw a warning don't know why
        audio.addEventListener("loadedmetadata", () => {
            audio.currentTime = music.progress;
            audio.volume = music.volume/100;
            updateMusic({
                audio,
                duration: audio.duration,
            })
        })
        return () => updateMusic({ audio: null });
    }, [ music.id ]);

    function updateMusic(update) {
        setMusic(prevState => ({
            ...prevState,
            ...update
        }));
    }
    return [music, setMusic];
}
