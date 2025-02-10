import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../assets/icons/project-icons'
import PopUp from '../../components/PopUp'
import { usePopUps } from '../../hooks/UsePopUps'
import { useEffect } from 'react'

function ErrorPage({message}) {
    const { popUps, addPopUp, removePopUp } = usePopUps();

    useEffect(()=>{
        addPopUp(message);
    },[])

    return (
        <div className='error-container'>
            {popUps.map((message, index) => (<PopUp key={index} message={message} onClose={removePopUp(index)}/>))}
            <FontAwesomeIcon icon="road-barrier" />
        </div>
    )
}

export default ErrorPage;