import "./Slider.css"

export default function Slider({ value, max, update }) {
    return (
        <>
            <label className="slider-label" htmlFor="slider-bar">Music slider bar</label>
            <input id="slider-bar" type="range" min="0" max={max ? max : 100} value={value} className="slider-bar" onChange={update} />
        </>
    )
}
