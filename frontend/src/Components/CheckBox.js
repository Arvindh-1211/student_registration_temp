function CheckBox(props) {
    return (
        <div>
            <input className='checkbox' type='checkbox' onClick={props.onClick} />
            <span className='checkbox-label'>{props.label}</span>
        </div>
    )
}

export default CheckBox