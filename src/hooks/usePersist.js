import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false); //if there persist data in the local stoeage (persist data has persist key in json format) then set to true, if not then leave as default for false

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist]) //saves the persist data to the local storage whenever the persist data changes 

    return [persist, setPersist]
}
export default usePersist

//persist data allows the ability for a browser to continue having local data even if the user refreshes it