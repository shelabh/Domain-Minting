
import router from "next/router"
import { useEffect, useState } from "react"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
	const [scroll, setScroll] = useState(false);
	const { currentAccount, connectWallet} = useContext(AppContext);

	const handleScroll = () => {
		if(window.scrollY >= 50){
			setScroll(true);
		}
		else{
			setScroll(false);
		}
			
	}
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
	})

	return (
		<div className={scroll ? "flex z-10 bg-black/60 backdrop-blur-md flex-row fixed w-full  md:pt-5 md:pb-5 md:items-center md:justify-around   pl-5  md:pl-0 " : "flex z-10 flex-row fixed w-full  md:pt-5 md:items-center md:justify-around   pl-5  md:pl-0 "}>
			<div className="text-4xl font-medium z-10 cursor-pointer pt-5 md:pt-0 " onClick={() => router.push('/')}>
				Solodraft
			</div>
			<div className="md:flex hidden flex-row gap-5  font-light">		
				<div className="cursor-pointer" onClick={() => router.push('/app/explore')}>
					Marketplace
				</div>
				<div className="cursor-pointer" onClick={() => router.push('/app/about')}> 
					Learn
				</div>
				<div className="cursor-pointer" onClick={() => router.push('/app/contact')} >
					Support
				</div>
			</div>
			{currentAccount ?  
				<div onClick={() => {router.push('/app/admin/dashboard')}}   className="border-2 cursor-pointer rounded-lg w-36 md:flex hidden flex-row items-center justify-center pt-1.5 pb-1.5">
					Dashboard
				</div>
				:
				<div onClick={connectWallet}   className="border-2 cursor-pointer rounded-lg w-36 md:flex hidden flex-row items-center justify-center pt-1.5 pb-1.5">
					Connect Wallet
				</div>
			}			
		</div>
	)
}

export default Navbar