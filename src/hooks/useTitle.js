import { useEffect } from "react";

const useTitle = (title) =>{
    useEffect(() =>{
        const prevTitle = document.title
        document.title = title //setting the doc title to the new title where this component it used.

        return () => document.title = prevTitle //whenever the component unmounts it sets the title to what it was before.

    }, [title])
}
export default useTitle