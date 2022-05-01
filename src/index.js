import React from 'react'
import './global.css'
import {initContract} from "./utils/utils";
import { render } from "react-dom";
import {
    Routes,
    Route, HashRouter,
} from "react-router-dom";
import Mint from "./pages/mint";
import Login from "./pages/login";
import GamePage from "./pages/gamePage";

window.nearInitPromise = initContract()
  .then(() => {
    render(
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </HashRouter>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
