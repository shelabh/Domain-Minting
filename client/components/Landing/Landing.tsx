import router from "next/router";



const Landing = () => {
	return (
		<>
			<div className="flex flex-col    h-screen  ">
				<div className="flex flex-row items-center w-full mt-[10rem] ">
					<div className=" w-full flex flex-col gap-6 p-4 pl-[10rem]">
						<div className=" font-bold text-7xl ">
							Claim your place in the <span className="text-black">web3</span> world.
						</div>
						<div className="text-2xl">
							Building decentralised digital identities for the world.
						</div>
						<div className="flex flex-row items-center gap-4 mt-20">
							<input 
								placeholder="Enter the City"
								value=".abuja"
								className="rounded-lg border-2 text-black border-[#C4C4C4] bg-[#D6D6D6] bg-opacity-25 md:w-96 w-[90%] p-2 focus:outline-none" 
							/>
							<div  className="bg-black text-white font-medium cursor-pointer w-36 flex flex-row items-center justify-center pt-2.5 pb-2.5 rounded-lg">
								<p>Search</p>
							</div>
						</div>
					</div>
					<div className=" w-full flex justify-end">
						<img src="/images/home.png" alt="home" draggable="false" className="" />
					</div>
				</div>
				<div className="flex flex-col gap-8 ml-[10rem] mt-10">
					<div className="text-2xl font-semibold">
						Trending Domains
					</div>
					<div className="flex flex-row gap-10">
						<div className="flex flex-row rounded-lg items-center justify-between w-80 bg-black p-6">
							<div className="flex flex-row items-center gap-4">
								<div>
									<img src="/images/Ellipse 1.svg" />
								</div>
								<div className="text-xl">
									.lagos
								</div>
							</div>
							<div>
								$10
							</div>
						</div>
						<div className="flex flex-row rounded-lg items-center justify-between w-80 bg-black p-6">
							<div className="flex flex-row items-center gap-4">
								<div>
									<img src="/images/Ellipse 1.svg" />
								</div>
								<div className="text-xl">
									.uyo
								</div>
							</div>
							<div>
								$15
							</div>
						</div>
						<div className="flex flex-row rounded-lg items-center justify-between w-80 bg-black p-6">
							<div className="flex flex-row items-center gap-4">
								<div>
									<img src="/images/Ellipse 1.svg" />
								</div>
								<div className="text-xl">
									.abuja
								</div>
							</div>
							<div>
								$20
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
		
	)
}

export default Landing;