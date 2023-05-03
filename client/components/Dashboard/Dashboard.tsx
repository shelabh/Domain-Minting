import { GetSessionParams, getSession, useSession, signOut } from "next-auth/react";


const Dashboard = () => {
	const {data: session} = useSession()
	const handleSignOut = () => {
		signOut({callbackUrl: '/'})
	}
	
	return (
		<>
			<div>
				<h4>User session:</h4>
				{session && 
					<div>{session?.user?.name}</div>
				}	
				<button onClick={() => handleSignOut()}>Sign out</button>
			</div>
		</>
	)
}


export async function getServerSideProps(context: GetSessionParams ) {
	const session = await getSession(context);
      
	// redirect if not authenticated
	if (!session) {
	  return {
	    redirect: {
	      destination: "/",
	      permanent: false,
	    },
	  };
	}
      
	return {
	  props: { user: session.user },
	};
      }

export default Dashboard;