
import router from "next/router"

import { useEffect, useState } from "react"

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";



const Navbar = () => {
	const [scroll, setScroll] = useState(false);

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
	const { connectAsync } = useConnect();
	const { disconnectAsync } = useDisconnect();
	const { isConnected } = useAccount();
	const { signMessageAsync } = useSignMessage();
	const { requestChallengeAsync } = useAuthRequestChallengeEvm();
	const { push } = useRouter();

	const handleAuth = async () => {
		if (isConnected) {
			await disconnectAsync();
		}

		const { account, chain } = await connectAsync({
			connector: new MetaMaskConnector(),
		});

		const { message } = await requestChallengeAsync({
			address: account,
			chainId: chain.id,
		}) as {message: string};

		

		const signature = await signMessageAsync({ message });

		// redirect user after success authentication to '/user' page
		const { url } = await signIn("moralis-auth", {
			message,
			signature,
			redirect: false,
			callbackUrl: "/app/dashboard",
		}) as {url: string};
		/**
		 * instead of using signIn(..., redirect: "/user")
		 * we get the url from callback and push it to the router to avoid page refreshing
		 */
		push(url);
	};

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
			<div onClick={handleAuth} className="border-2 cursor-pointer rounded-lg w-36 md:flex hidden flex-row items-center justify-center pt-1.5 pb-1.5">
				Connect Wallet
			</div>
			
		</div>
	)
}


export default Navbar