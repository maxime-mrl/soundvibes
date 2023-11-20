export default function CoverImage({ music }) {
    if (!music || (!music.id && !music._id) || !music.title) return (
        <img src={``} alt={`Cover for music`} className="cover-img" />
    )
    return (
        <img src={`http://192.168.1.100:80/public/${music.id ? music.id : music._id}/cover.jpg`} alt={`Cover for music ${music.title}`} className="cover-img" />
    )
}
