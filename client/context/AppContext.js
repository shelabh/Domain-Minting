import React, { createContext, useEffect, useState } from "react";
import { networks } from "../utils/networks"
const { ethereum } = typeof window !== "undefined" ? window : {};
export const AppContext = createContext();
const AppProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState('')
	const [network, setNetwork] = useState('')

  	const connectWallet = async () => {
		try {
			if(!ethereum) {
				alert("Get MetaMask -> https://metamask.io/")
				return
			}
			const accounts = await ethereum.request({ method: "eth_requestAccounts" })

			console.log("Connected", accounts[0])
			setCurrentAccount(accounts[0])
		} catch(err) {
			console.log(err)
		}
	}

	const checkIfWalletIsConnected = async () => {
		if(!ethereum) {
			console.log("Make sure you have metamask!")
			return
		} else {
			console.log("We have the ethereum object", ethereum)
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if(accounts.length !== 0) {
			const account = accounts[0]
			console.log("Found an authorized account:", account)
			setCurrentAccount(account)
		} else {
			console.log('No authorized account found')
		}

		const chainId = await ethereum.request({ method: 'eth_chainId' })
		setNetwork(networks[chainId])

		ethereum.on('chainChanged', (_chainId) => window.location.reload())
	}

  	useEffect(() => {
		checkIfWalletIsConnected();
	}, [currentAccount])

	return (
		<AppContext.Provider value={{ currentAccount, connectWallet }}>
			{children}
		</AppContext.Provider>
	);
};
export default AppProvider;