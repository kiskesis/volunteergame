import 'regenerator-runtime/runtime'
import React, {useState} from 'react'

import './index.css'
import Humanitarian from '../../assets/Humanitarian.svg'

export default function Food() {
    const [img, setImg] = useState(Humanitarian)

    // useEffect(() => {
    //     switch (eatingTimes) {
    //         case 1:
    //             setImg(FullFood)
    //             break;
    //         default:
    //             break;
    //     }
    // }, [eatingTimes])

    return (
        <div className="humanitarian">
            <img
                src={img}
                className="humanitarian-img"
                alt="humanitarian image"
            />
        </div>
    )
}
