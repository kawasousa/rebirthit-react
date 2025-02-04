import { useState } from "react";

export function usePopUps(){
    const [popUps, setPopUps] = useState([]);

    function addPopUp(message){
        setPopUps(prevPopUps => [...prevPopUps, message]);
    }

    function removePopUp(index){
        setPopUps(prevPopUps => prevPopUps.filter((_, i) => i !== index));
    }

    return {popUps, addPopUp, removePopUp};
}