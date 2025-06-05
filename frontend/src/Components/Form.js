import '../css/Form.css'

function Form({ children, handleNext, handleBack, heading }) {
    return (
        <div className='form-container'>
            <form className='form' onSubmit={handleNext}>
                <div className='form-header'>{heading}</div>
                <div className='form-fields'>
                    {children}
                </div>
                <div className='button-container'>
                    <div>
                        {handleBack &&
                            <input className='button' type='button' value="Previous" onClick={handleBack} />
                        }
                    </div>
                    <div>
                        <input className='button' type='submit' value="Next" onSubmit={handleNext} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Form
