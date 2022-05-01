import './index.css'
import Left from "../../assets/Left Arrow.svg";
import Right from "../../assets/Right Arrow.svg";

    export default function Attribute({ name, attribute, handleUpdate, handleUnused, defaultUnused, unused, defaultAttr }) {
    const handleUp = () => {
        if (unused > 0) {
            handleUpdate(attribute + 1)
            handleUnused(unused - 1)
        }
    }

    const handleDown = () => {
        console.log('unused', unused);
        if (defaultUnused > unused && defaultAttr !== attribute) {
            handleUpdate(attribute - 1)
            handleUnused(unused + 1)
        }
    }

    return (
        <div className="attribute">
            <div className="attribute-name">{name}:</div>
            <img
                onClick={handleDown}
                className="left-arrow"
                src={Left}
                alt=""
            />
            <div>{attribute}</div>
            <img
                onClick={handleUp}
                className="right-arrow"
                src={Right}
                alt=""
            />
        </div>
    )
}