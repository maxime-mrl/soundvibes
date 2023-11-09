import "./Slider.css"

export default function Slider({ value, setValue }) {
    return (
        <input type="range" min="0" max="100" value={value} className="slider-bar" onChange={(e) => setValue(e.target.value)} />
    )
}
