import 'regenerator-runtime/runtime'
import React, {useState} from 'react'

import Volunteer from '../../assets/Basic volunteer.svg'
import './index.css'

export default function Character() {
    const [img, setImg] = useState(Volunteer)
    // useEffect(() => {
    //     setImg(eating ? LionEats : Lion)
    // }, [eating])
    return (
        <div className="character-card">
            <img
                src={img}
                alt="animal image"
            />
        </div>
    )
}
