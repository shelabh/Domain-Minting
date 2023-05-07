import { useContext } from "react";
import { AppContext } from "../../context/AppContext";


const Dashboard = () => {
	const { currentAccount } = useContext(AppContext);

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center">
				<h4>User address:</h4>
				<div>{currentAccount}</div>
			</div>
		</>
	)
}



export default Dashboard;