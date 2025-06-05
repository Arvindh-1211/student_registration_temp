import '../css/Error.css'
import { MdOutlineErrorOutline } from "react-icons/md"

function Error({ message }) {
    return (
        <div className='error'>
            <div className='error-message'><MdOutlineErrorOutline />{message}</div>
        </div>
    )
}

export default Error