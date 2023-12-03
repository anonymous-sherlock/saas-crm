"use client"
import { Crisp } from "crisp-sdk-web"
import { LifeBuoy } from 'lucide-react'
import Link from "next/link"
import { FC } from 'react'
interface CrispChatOpenProps {

}

const CrispChatOpen: FC<CrispChatOpenProps> = ({ }) => {

	function OpenChat() {
		Crisp.chat.open()
	}

	return (
		<Link
			href="#support"
			onClick={OpenChat}
			className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white "
		>
			<LifeBuoy size={16} className="mr-2 text-gray-400" />
			Support
		</Link>
	)
}

export default CrispChatOpen