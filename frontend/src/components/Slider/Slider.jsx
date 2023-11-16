import "./Slider.css"

export default function Slider({ value, max, update }) {
    return (
        <input type="range" min="0" max={max ? max : 100} value={value} className="slider-bar" onChange={update} />
    )
}
