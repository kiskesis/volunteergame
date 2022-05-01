import React, {useEffect, useState} from 'react'

import getConfig from '../../config'
import NFT from "../../components/NFT";
import './index.css'
import PageWrapper from "../../components/pageWrapper";
import {utils} from "near-api-js";

const {networkId} = getConfig(process.env.NODE_ENV || 'development')

export default function Mint() {
    const [isLoading, setIsLoading] = useState(false)
    // when the user has not yet interacted with the form, disable the button
    const [buttonDisabled, setButtonDisabled] = React.useState(true)
    const [userHasNFT, setUserHasNFT] = React.useState(false)

    // after submitting the form, we want to show Notification
    const [showNotification, setShowNotification] = React.useState(false)

    useEffect(() => {
        const receivedNFT = async () => {
            setIsLoading(true)
            const hasToken = await window.contract.check_token()
            setIsLoading(false)
            if (window.accountId !== "") {
                setUserHasNFT(
                    hasToken
                );
            }
        };
        receivedNFT();
    }, []);

    const mintNFT = async () => {
        await window.contract.nft_mint(
            {
                token_type: "Volunteer",
            },
            300000000000000, // attached GAS (optional)
            utils.format.parseNearAmount("1")
        );
    };

    return (
        <PageWrapper isLoading={isLoading}>
            <main className="main">
                <NFT />
                <div className="mint-button">
                    <button disabled={userHasNFT} onClick={mintNFT}>Mint</button>
                </div>
            </main>
            {showNotification && <Notification />}
        </PageWrapper>
    )
}

// this component gets rendered by App after the form is submitted
function Notification() {
    const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
    return (
        <aside>
            <a
                target="_blank"
                rel="noreferrer"
                href={`${urlPrefix}/${window.accountId}`}
            >
                {window.accountId}
            </a>
            {' '/* React trims whitespace around tags; insert literal space character when needed */}
            called method: 'set_greeting' in contract:
            {' '}
            <a
                target="_blank"
                rel="noreferrer"
                href={`${urlPrefix}/${window.contract.contractId}`}
            >
                {window.contract.contractId}
            </a>
            <footer>
                <div>✔ Succeeded</div>
                <div>Just now</div>
            </footer>
        </aside>
    )
}
