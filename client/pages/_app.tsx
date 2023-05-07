import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar/Navbar'
import { useRouter } from 'next/router';
import AppProvider from "../context/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = router.pathname 
  const noNav = ['/app/signin', '/app/signup']
  return (
    <AppProvider>
      <Head>
        <title>Mienai</title>
        <meta name="description" content="Solodraft" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {noNav.includes(showNavbar) ? null : <Navbar />}
      <Component {...pageProps} />
    </AppProvider>
  )
}
