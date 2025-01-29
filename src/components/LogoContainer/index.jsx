import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function LogoContainer({ extraClasses }) {
    return (
        <div className={`logo-container ${extraClasses || ''}`}>
            <h1>RebirthIt</h1>
            <FontAwesomeIcon icon="bug" size='2x' />
        </div>
    )
}

export default LogoContainer