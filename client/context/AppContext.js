import React, { createContext, useEffect, useState } from "react";
import { networks } from "../utils/networks";
import { ethers } from 'ethers';
import contractABI  from '../utils/contractABI/Domains.json';
import { app, database } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const dbInstance = collection(database, 'users');
const { ethereum } = typeof window !== "undefined" ? window : {};
export const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState('')
	const [mints, setMints] = useState([])
	const [domain, setDomain] = useState('')
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

	const switchNetwork = async () => {
		if(ethereum) {
			try {
				await ethereum.request({ 
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0xaa36a7' }]
				})

			} catch(err) {
				// This error code means that the chain we want has not been added to MetaMask
      				// In this case we ask the user to add it to their MetaMask
				if(err.code === 4902) {
					try {
						await ethereum.request({ 
							method: 'wallet_addEthereumChain',
							params: [{
								chainId: '0xaa36a7',
								chainName: networks['0xaa36a7'],
								rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/576pcMlzyyJpVI0Gzl2G2ESWWlpAMIBt'],
								nativeCurrency: {
									name: 'ETH',
									symbol: 'ETH',
									decimals: 18
								},
								blockExplorerUrls: ['https://sepolia.etherscan.io/']
							}]
					 	})

					} catch(err) {
						console.log(err)
					}
				}
			}
		} else {
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download')
		}
	}
	const mintDomain = async () => {
		// Don't run if the domain is empty
		if(!domain) return
		// Alert the user if the domain is too short
		if(domain.length < 3) {
			alert('Domain must be at least 3 characters long')
			return
		}
		// Calculate price based on length of domain (change this to match your contract)	
		// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
		const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1'
		console.log("Minting domain", domain, "with price", price)

		try {
			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const contractAddress = "0x807693170612eB7C37b9A5A543eA1f4865a6F259"
				const contract = new ethers.Contract(contractAddress, contractABI.abi, signer)

				console.log('Going to pop wallet now to pay gas...')

				let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) })
				const receipt = await tx.wait()

				if(receipt.status === 1) {
					console.log(`Domain minted! https://sepolia.etherscan.io/address/${currentAccount}`)

					// tx = await contract.setRecord(domain, record)
					// await tx.wait()

					// console.log(`Record set! https://sepolia.etherscan.io/address/${currentAccount}`)

					setTimeout(() => {
						fetchMints()
					}, 2000)

					// setRecord('')
					setDomain('')
					addDoc(dbInstance, {
						currentAccount: currentAccount,
						domain: domain,
					})

				} else {
					alert('Transaction failed, please try again later')
				}
				
			}
		} catch(err) {
			console.log(err)
		}
	}

	const fetchMints = async () => {
		try {

			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const contractAddress = " 0x807693170612eB7C37b9A5A543eA1f4865a6F259"
				const contract = new ethers.Contract(contractAddress, contractABI.abi, signer)

				// Get all domain names from our contract
				const names = await contract.getAllNames()
				console.log(names)

				// For each name, get the record and address
				const mintRecords = await Promise.all(names.map(async name => {

					// const mintRecord = await contract.records(name)
					const owner = await contract.domains(name) ? contract.domains(name) : null;

					return {
						id: names.indexOf(name),
						name: name,
						// record: mintRecord,
						owner: owner
					}

				}))

				console.log(`Mints Fetched ${mintRecords}`)
				setMints(mintRecords)
			}
		} catch(err) {
			console.log(err)
		}
	}
	const renderMints = () => {
		const contractAddress = " 0x807693170612eB7C37b9A5A543eA1f4865a6F259"
		if(currentAccount && mints.length > 0) {
			return (
				<div className='mint-container'>
					<p className='subtitle'>Recently minted domains!</p>
					<div className='mint-list'>
						{mints.map((mint, index) => {
							return (
								<div className='mint-item' key={index}>
									<div className='mint-row'>
										<a className='link' href={`https://testnets.opensea.io/assets/mumbai/${contractAddress}/${mint.id}`} target="_blank" rel="noopener noreferrer">
											<p className='underlined'>{' '}{mint.name}{TOP_LEVEL_DOMAIN}{' '}</p>
										</a>
										{/* If mint.owner is currentAccount, add an edit button */}
										{mint.owner.toLowerCase() === currentAccount.toLowerCase() && 
											<button className="edit-button" onClick={() => editRecord(mint.name)}>
												<img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
											</button>
										}
									</div>
									<p>{mint.record}</p>
								</div>
							)
						})}
					</div>
				</div>
			)
		}
	}


  	useEffect(() => {
		checkIfWalletIsConnected();
	}, [currentAccount])



	return (
		<AppContext.Provider value={{ currentAccount, connectWallet, network, switchNetwork, domain, setDomain, mintDomain, mints, renderMints }}>
			{children}
		</AppContext.Provider>
	);
};
export default AppProvider;