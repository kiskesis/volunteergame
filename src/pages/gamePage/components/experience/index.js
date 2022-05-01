import './index.css'
import LoadingBorders from '../../assets/LoadingBorders (1).svg'
import LoadingZone from '../../../../assets/LoadingZone (1).svg'
import {useInterval} from "../../../../utils/hooks";
import {useState} from "react";

export default function Experience({ exp, maxExp }) {
    const maxPercentages = exp / (40 / 100)
    const [percentages, setPercentages] = useState(0)

    useInterval(() => {
        if (percentages < maxPercentages) {
            setPercentages(percentages + 2)
        }
    },percentages < maxPercentages ? 500 : null)
    return (
        <div className="experience">
            <img src={LoadingBorders} className="loading-borders" alt="loading borders" />
            <img
                src={LoadingZone}
                style={{
                    width: `calc((${percentages > 100 ? 100 : percentages}%) - 45px)`
                }}
                alt="loading zone"
                className="loading-bar"
            />
            <div className="experience-numbers">
                {exp}/{maxExp}
            </div>
        </div>

    )
}