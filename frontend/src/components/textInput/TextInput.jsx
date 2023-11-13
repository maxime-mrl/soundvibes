import "./TextInput.css";

export default function TextInput({ label, input, validation, updateForm, valueState }) {
    return (
        <div className="text-input-container">
            <input
                className="text-input"
                type={input.type}
                name={input.name}
                id={input.name}
                placeholder={input.placeholder}
                autoComplete={input.autoComplete}
                data-validate={validation}
                value={valueState}
                onChange={updateForm}
            />
            <label htmlFor={input.name} className="text-label">
                <div className="regular">{label.regular}</div>
                <div className="error">{label.error}</div>
            </label>
        </div>
    )
}
