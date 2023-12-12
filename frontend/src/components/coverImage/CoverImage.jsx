import "./CoverImage.css"

export default function CoverImage({ music }) {
    // if not enough music infos show a unset image
    if (!music || (!music.id && !music._id) || !music.title) return (
        <img src={`/img/music-default.jpg`} alt={`Cover for an undefined music`} className="cover-img" />
    )
    // else return an image cover from music id
    return (
        <img src={`http://${window.location.hostname}:80/public/${music.id ? music.id : music._id}/cover.jpg`} alt={`Cover for music ${music.title}`} className="cover-img" />
    )
}
