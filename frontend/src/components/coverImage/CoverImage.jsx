import "./CoverImage.css"

export default function CoverImage({ music }) {
    if (!music || (!music.id && !music._id) || !music.title) return (
        <img src={`/img/music-default.jpg`} alt={`Cover for music`} className="cover-img" />
    )
    return (
        <img src={`http://${window.location.hostname}:80/public/${music.id ? music.id : music._id}/cover.jpg`} alt={`Cover for music ${music.title}`} className="cover-img" />
    )
}
