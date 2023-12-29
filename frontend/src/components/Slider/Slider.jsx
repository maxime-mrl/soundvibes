import "./Slider.css"

export default function Slider({ value, max, update }) {
    return (
        <input id="slider-bar" type="range" min="0" max={max ? max : 100} value={(max && value) ? value : 0} className="slider-bar" onChange={update} aria-label="Music slider bar" />
    )
}
