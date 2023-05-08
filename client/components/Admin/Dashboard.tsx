import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, SetStateAction, useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import router from "next/router";

const TOP_LEVEL_DOMAIN = '.lagos'

const Dashboard = () => {
	const { currentAccount, domain, setDomain, mintDomain, mints, renderMints} = useContext(AppContext);
	
	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState(1);
	
	const handleSelect = (e: SetStateAction<number>) => {
		setSelected(e)
	};
	
	const renderInputForm = () => {
		// if(network !== 'Sepolia ETH') { 
		// 	return (
		// 		<div className='connect-wallet-container'>
		// 			<h2>Please connect to Sepolia ETH</h2>
		// 			<button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
		// 		</div>
		// 	)
		// }
		return (
			<div className='form-container'>
				<div className='flex '>
					<input type='text' className="text-black" value={domain} placeholder='Enter domain name' onChange={e => setDomain(e.target.value)} />
					<p className='tld'>{TOP_LEVEL_DOMAIN}</p>
				</div>
				<div className='button-container'>
					<button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>Mint</button>  
				</div>
				

				
			</div>
		)
	}
	// const renderMints = () => {
	// 	setTimeout(() => {
	// 		fetchMints()
	// 	}, 2000)
	// 	const contractAddress = "0x807693170612eB7C37b9A5A543eA1f4865a6F259"
	// 		return (
	// 			<div className='flex flex-col justify-between gap-10'>
	// 				<p className='text-4xl font-bold'>
	// 					Recently minted domains
	// 				</p>
	// 				{currentAccount && mints.length > 0 ?
	// 				<div className=''>
	// 					{mints.map((mint: any, index: any) => {
	// 						return (
	// 							<div className='mint-item' key={index}>
	// 								<div className='border text-white'>
	// 									<a className='link' href={`https://sepolia.etherscan.io/address/${contractAddress}/${mint.id}`} target="_blank" rel="noopener noreferrer">
	// 										<p className='underlined'>{' '}{mint.name}{TOP_LEVEL_DOMAIN}{' '}</p>
	// 									</a>
	// 									{/* If mint.owner is currentAccount, add an edit button
	// 									{mint.owner.toLowerCase() === currentAccount.toLowerCase() && 
	// 										<button className="edit-button" onClick={() => editRecord(mint.name)}>
	// 											<img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
	// 										</button>
	// 									} */}
	// 								</div>
	// 								<p>{mint.record}</p>
	// 							</div>
	// 						)
	// 					})}
	// 				</div>
	// 				: 
	// 				<div className="">
	// 					Nothing Minted	
	// 				</div>
	// 				} 
	// 			</div>
	// 		)
		
	// }
	

	

	return (
		<div className="bg-gradient-to-br from-[#A78BF6] via-[#724DDB] to-[#471DC0] flex flex-row w-full h-full ">
			<div className="flex flex-col  bg-black bg-opacity-60 p-8 w-80 ">
				<div onClick={() => {router.push("/")}} className="text-white font-bold text-4xl">
					SoloDraft
				</div>
				<div className="flex flex-col justify-center mt-20 gap-5">
					<div onClick={() => handleSelect(1)} className="">
						Home
					</div>
					<div onClick={() => handleSelect(2)}>
						Mint Domains
					</div>
					<div>
						Settings
					</div>
				</div>
			</div>
			{selected === 1 && 
				<div className=" w-full h-screen  p-8">
					{renderMints()}
				</div>
			}
			{selected === 2 && 
				<div className=" w-full h-screen flex flex-col justify-center items-center">
					<h4>Your address:</h4>
					<div>{currentAccount}</div>
					<div>
						{renderInputForm()}
					</div>
				</div>
			}	
		</div>
	)
}



export default Dashboard;