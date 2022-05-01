import './index.css'

import Helmet from '../../assets/items/Helmet.svg'
import Armor from '../../assets/items/Armor.svg'
import Car from '../../assets/items/Car.svg'
import Bicycle from '../../assets/items/Bicycle.svg'
import {useState} from "react";
import {utils} from "near-api-js";

export default function ItemShop({ getAttribute, setLoading, items }) {
    const [selectedItem, setSelectedItem] = useState(null)
    const itemsData = [
        {
            img: Helmet,
            title: 'Helmet',
            bonus: {health: 20, chance: '+2%'},
            description: 'Helmet for better safety, increase chance to get better deliver on 2%',
            itemType: 'Helmet',
            have: items.helmet,
            cost: 2
        },
        {
            img: Armor,
            title: 'Armor',
            bonus: {health: 50, chance: '+4%'},
            description: 'Armor is the best choic when you are working on humanitarian in Ukraine war zones. Increase chance to get better deliver on 4% and health on 50',
            itemType: 'Armor',
            have: items.armor,
            cost: 5
        },
        {
            img: Car,
            title: 'Car',
            bonus: {health: 25, chance: '+10%'},
            description: 'Car allows you to deliver fast that means safe. Increase chance to get better deliver on 10% and health on 25',
            itemType: 'Car',
            have: items.car,
            cost: 7
        },
        {
            img: Bicycle,
            title: 'Bicycle',
            bonus: {health: 5, chance: '+3%'},
            description: 'By bicycle is better than by foot. Increase chance to get better deliver on 3% and health on 5',
            itemType: 'Bicycle',
            have: items.bicycle,
            cost: 2
        },
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

    const handleBuyItem = async (item) => {
        setLoading(true)
        console.log('item.cost', item.cost);
        await window.contract.buy_item(
            {
                item: item.itemType,
            },
            300000000000000, // attached GAS (optional)
            utils.format.parseNearAmount(item.cost.toString())
        );
        await getAttribute()
    }

        return (
        <div className="items-shop">
            <h3>Shop:</h3>
            <div className="item-list">
                {
                    itemsData.map(item => !item.have ? (
                        <div
                            key={item.title}
                            className="item-div"
                            onClick={() => handleSelect(item)}
                        >
                            <img
                                key={item.title}
                                src={item.img}
                                alt="smth"
                            />
                        </div>
                    ) : (
                        <div className="item-div" />
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
                        <button onClick={() => handleBuyItem(selectedItem)}>Buy</button>
                    </>
                )
            }
        </div>
    )
}