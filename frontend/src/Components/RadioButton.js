import { Controller } from "react-hook-form";
import '../css/RadioButton.css';

function RadioButton({ label, options, fieldname, formcontrol, error, required, inline = false }) {
    const radioOptions = options ? Object.entries(options).map(([key, val]) => ({
        value: key,
        label: val
    })) : [];

    return (
        <div className='radioButton'>
            <div className='radio-label'>
                {label} {required && <span className='required'>*</span>}
            </div>
            <Controller
                name={fieldname}
                control={formcontrol}
                render={({ field }) => (
                    <div className={`radio-options ${inline ? 'inline' : 'vertical'}`}>
                        {radioOptions.map((option) => (
                            <div key={option.value} className="radio-option">
                                <input
                                    type="radio"
                                    id={`${fieldname}-${option.value}`}
                                    value={option.value}
                                    checked={field.value === option.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="radio-input"
                                />
                                <label 
                                    htmlFor={`${fieldname}-${option.value}`}
                                    className="radio-option-label"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            />
            {error && <div className="radio-error">{error}</div>}
        </div>
    );
}

export default RadioButton;