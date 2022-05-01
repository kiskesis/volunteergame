import './index.css'

import Helmet from '../../assets/items/Helmet.svg'
import Armor from '../../assets/items/Armor.svg'
import Car from '../../assets/items/Car.svg'
import Bicycle from '../../assets/items/Bicycle.svg'
import {useState} from "react";

export default function ItemsBar({ items }) {
    const [selectedItem, setSelectedItem] = useState(null)
    const itemsData = [
        {
            img: Helmet, title: 'Helmet', bonus: { health: 20, chance: '+2%' }, description: 'Helmet for better safety, increase chance to get better deliver on 2%', itemType: 'Helmet', have: items.helmet
        },
        {img: Armor, title: 'Armor', bonus: { health: 50, chance: '+4%' }, description: 'Armor is the best choic when you are working on humanitarian in Ukraine war zones. Increase chance to get better deliver on 4% and health on 50', itemType: 'Armor', have: items.armor},
        {img: Car, title: 'Car', bonus: { health: 25, chance: '+10%' }, description: 'Car allows you to deliver fast that means safe. Increase chance to get better deliver on 10% and health on 25', itemType: 'Car', have: items.car},
        {img: Bicycle, title: 'Bicycle', bonus: { health: 5, chance: '+3%' }, description: 'By bicycle is better than by foot. Increase chance to get better deliver on 3% and health on 5', itemType: 'Bicycle', have: items.bicycle},
    ];

    const handleSelect = (item) => {
        console.log('item', item);
        console.log('selectedItem', selectedItem);
        if (item.title === selectedItem?.title) {
            setSelectedItem(null)
        } else {
            setSelectedItem(item)
        }
    }

    return (
        <div className="items-bar">
            <h3>Your items:</h3>
            <div className="item-list">
                {
                    itemsData.map(item => item.have ? (
                        <div key={item.title} className="item-div" onClick={() => handleSelect(item)}>
                            <img
                                src={item.img}
                                alt="smth"
                            />
                        </div>
                    ) : (
                        <div key={item.title} className="item-div" />
                    ))
                }
            </div>
            {
                selectedItem && (
                    <>
                        <h3>Selected Item</h3>
                        <div className="selected-item-div">
                            <div className="item-div">
                                {
                                    selectedItem && (
                                        <img
                                            src={selectedItem.img}
                                            alt="smth"
                                        />
                                    )
                                }
                            </div>
                            <div className="item-description">
                                <p>Name: {selectedItem.title}</p>
                                <p>Bonuses:
                                    {selectedItem.bonus.health ? `health: ${selectedItem.bonus.health} ${selectedItem.bonus.chance ? ', ' : ''}` : ''}
                                    {selectedItem.bonus.chance && `chance: ${selectedItem.bonus.chance}`}
                                </p>
                                <p>Description: {selectedItem.description}</p>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}