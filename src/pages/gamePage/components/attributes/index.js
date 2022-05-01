import './index.css'
import Attribute from "../attribute";
import {useEffect, useState} from "react";

export default function Attributes({getAttribute, attributes, setIsLoading}) {
    const [strength, setStrength] = useState(attributes.strength)
    const [health, setHealth] = useState(attributes.health_attr)
    const [unused, setUnused] = useState(attributes.unused_points)

    useEffect(() => {
        setStrength(attributes.strength)
        setHealth(attributes.health_attr)
        setUnused(attributes.unused_points)
    }, [attributes])

    const handleUpgrade = async () => {
        const newAttributes = {
            strength,
            health_attr: health,
        };
        setIsLoading(true)
        await window.contract.upgrade_attr({
            updating_attributes: newAttributes
        });
        await getAttribute()
    }

    return (
        <div className="attributes-block">
            <h2>Attributes: {unused}</h2>
            <Attribute
                handleUpdate={setStrength}
                handleUnused={setUnused}
                name="Strength"
                attribute={strength}
                defaultUnused={attributes.unused_points}
                defaultAttr={attributes.strength}
                unused={unused}
            />
            <Attribute
                handleUpdate={setHealth}
                handleUnused={setUnused}
                name="Health"
                attribute={health}
                defaultUnused={attributes.unused_points}
                defaultAttr={attributes.health_attr}
                unused={unused}
            />
            <button
                onClick={handleUpgrade}
                className="attributes-save-button"
                disabled={unused === 0}
            >Save
            </button>
        </div>
    )
}