
import { Inter } from 'next/font/google'
import Landing from '../components/Landing/Landing'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="  bg-gradient-to-br from-[#A78BF6] via-[#724DDB] to-[#471DC0]">
      <Landing />
    </div>
  )
}
