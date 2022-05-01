import 'regenerator-runtime/runtime'
import React, {useEffect, useState} from 'react'

import './index.css'
import {login} from "../../utils/utils";
import {useNavigate} from "react-router-dom";
import Loading from "../../components/loading";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
            checkToken()
        }
    }, [])

    const handleLogin = async () => {
        await login()
        await checkToken()
    }

    const checkToken = async () => {
        setIsLoading(true)
        const hasToken = await window.contract.check_token({
            token_type: "Lion"
        });
        setIsLoading(false)
        navigate(hasToken ? "/game" : "/mint")
    }

    return (
        <main>
            <h1>Welcome to Ukrainian Volunteer mini-game!</h1>
            <p style={{textAlign: 'center'}}>
                This is a volunteer project the main goal is to help Ukrainian people with donations to humanitarian and allow getting some fun and NFT to helpers
            </p>
            <p style={{textAlign: 'center'}}>
                <button onClick={handleLogin}>Sign in</button>
            </p>
            <p>
                An application contains that parts:
            </p>
            <ol>
                <li>Mint NFT if you don't have one. This NFT will be your character</li>
                <li>Buy humanitarian and try to deliver it (all money from the game going to real humanitarian)!</li>
                <li>It is dangerous to deliver humanitarian in War zones, so it will be a good idea to buy armor or helmet..</li>
                <li>By updating your level you will have more abilities and stats.</li>
                <li>Have fun and help Ukrainian people!</li>
            </ol>
            <p>
                Go ahead and click the button below to try it out:
            </p>
            {isLoading && <Loading />}
        </main>
    )
}
