import loadingOuter from '../assets/loadingOuter.png'
import loadingInner from '../assets/loadingInner.png'

import '../css/Loading.css'

function Loading() {
    return (
        <div className='Loading'>
            <div className='loading'>
                <img className='loading-outer' src={loadingOuter} alt='Loading' />
                <img className='loading-inner' src={loadingInner} alt='...' />
            </div>
        </div>
    )
}

export default Loading
