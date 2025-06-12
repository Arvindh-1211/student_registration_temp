import '../css/InputField.css';

function InputField({ label, registerProps, type, error, readOnly, placeholder, required}) {
    return (
        <div>
            <div className='InputField'>
                <div className='inputfield-label'>
                    {label}
                    {required && <span className='required'>*</span>}
                </div>
                <input
                    className='inputfield'
                    type={type}
                    placeholder={placeholder}
                    {...registerProps}
                    readOnly={readOnly}
                    step='0.01'
                />
            </div>
            <div className='inputfield-error'>{error}</div>
        </div>
    )
}

export default InputField