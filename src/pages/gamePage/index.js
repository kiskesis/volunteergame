import React, {useEffect, useState} from 'react'
import Character from "./components/character";
import PageWrapper from "../../components/pageWrapper";
import {useInterval} from "../../utils/hooks";
import Humanitarian from "./components/humanitarian";
import { utils } from "near-api-js";
import Experience from "./components/experience";
import ItemsBar from "./components/itemsBar";
import EventModal from "./components/eventModal";
import ItemShop from "./components/itemShop";
import './index.css'
import Attributes from "./components/attributes";

export default function GamePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [eating, setEating] = useState(false)
    const [eventModal, setEventModal] = useState(false)
    const [eatingTimes, setEatingTimes] = useState(0)
    const [humanitarianInput, setHumanitarianInput] = useState(0)
    const [userBalance, setUserBalance] = useState(0)
    const [attributes, setAttributes] = useState({
        health: 0,
        max_experience: 0,
        attributes: {
            max_health: 0,
        },
        items: {
            helmet: false,
            car: false,
            bicycle: false,
            armor: false,
        }
    })

    useEffect(() => {
        const getUserBalance = async () => {
            window.balance = await window.account.getAccountBalance()
            setUserBalance(utils.format.formatNearAmount(window.balance.available));
        }
        getUserBalance()
        getAttributes()
    }, [])

    useInterval(() => {
        setEating(!eating)
        setEatingTimes(eatingTimes + 1)
    }, eatingTimes && eatingTimes <= 10 ? 600 : null)

    const getAttributes = async () => {
        const card_attr = await window.contract.get_attributes();
        setAttributes(card_attr)
        setIsLoading(false)
    }

    // if (!attributes) {
    //     return (
    //         <div></div>
    //     )
    // }

    const deliverHumanitarian = async () => {
        setIsLoading(true)
        const card_attr = await window.contract.deliver_humanitarian();
        setAttributes({
            ...card_attr.card_attr,
            ...card_attr,
        })
        setEventModal(true)
        setIsLoading(false)
    }

    const handleFoodInputChange = (e) => {
        setHumanitarianInput(e.target.value)
    }

    const restoreHealth = async () => {
        setIsLoading(true)
        await window.contract.restore_health();
        setIsLoading(false)
        setAttributes({
            ...attributes,
            health: 100
        })
    }

    const buyFood = async () => {
        setIsLoading(true)
        const contracthumanitarianCount = await window.contract.buy_humanitarian(
            {},
            300000000000000, // attached GAS (optional)
            utils.format.parseNearAmount(humanitarianInput || "1")
        );
        setIsLoading(false)
        setAttributes({
            ...attributes,
            humanitarian: contracthumanitarianCount
        })
    }

    const level = attributes?.max_experience / 40 - 1

    return (
        <PageWrapper isLoading={isLoading}>
            <div className="game-page">
                <div className="character-panel">
                    <Character />
                    <div className="animal-info">
                        <h2>{`LVL: ${level}`}</h2>
                        <h2>Name: Boris</h2>
                        <h2>Health: {attributes.health}/{attributes.attributes.max_health}</h2>
                        <Attributes getAttribute={getAttributes} attributes={attributes.attributes} setIsLoading={setIsLoading} />
                    </div>
                </div>
                <div className="items-panel">
                    <Experience exp={attributes.experience} maxExp={attributes.max_experience} />
                    <div className="food-row">
                        <div className="food-count">{attributes.humanitarian} X</div>
                        <Humanitarian />
                    </div>
                    <div className="character-buttons">
                        <div className="donation-row">
                            <label htmlFor="donation">Humanitarian:</label>
                            <input
                                autoComplete="off"
                                onChange={handleFoodInputChange}
                                defaultValue={humanitarianInput}
                                id="donation"
                                max={userBalance}
                                min="0"
                                step="1"
                                type="number"
                            />
                            <span title="NEAR Tokens">Ⓝ</span>
                        </div>
                        <button onClick={buyFood}>Buy humanitarian</button>
                        <button disabled={attributes.humanitarian === 0} onClick={deliverHumanitarian}>Deliver Humanitarian</button>
                        <button onClick={restoreHealth}>Restore Health</button>
                    </div>
                </div>
            </div>
            <div className="attributes">
                <ItemsBar items={attributes.items} />
                <ItemShop getAttribute={getAttributes} setLoading={setIsLoading} items={attributes.items} />
            </div>
            {eventModal && <EventModal setEventModal={setEventModal} event={attributes} />}
        </PageWrapper>
    )
}
