import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/icons/project-icons'
import './style.css'
import { useEffect, useState } from 'react';

function PopUp({ message, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setIsVisible(false);
            onClose();
        }, 2000);

        return ()=> clearTimeout(timeout);
    }, [onClose]);

    return (
        isVisible &&
        <div className="popup">
            <p>{message}</p>
            <FontAwesomeIcon icon='triangle-exclamation' bounce />
        </div>
    )
}

export default PopUp;