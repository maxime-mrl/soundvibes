import { useEffect } from "react"
import "./MusicSlider.css"

export default function MusicSlider({ value, max, update }) {
    useEffect(() => {
    })
    return (
        <input type="range" min="0" max={max ? max : 100} value={value} className="slider-bar" onChange={update} />
    )
}
