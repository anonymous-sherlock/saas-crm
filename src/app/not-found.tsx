import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import Navbar from "@/components/layouts/header/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
	return (
		<main className="min-h-screen h-full grainy">
			<Navbar />
			<MaxWidthWrapper className=" mb-12 mt-20 sm:mt-20 flex flex-col items-center justify-center text-center">
				<div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
					<p className="text-sm font-semibold text-gray-700">adscrush crm is now public! 🎉</p>
				</div>
				<h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
				Oops <span className="text-blue-600">Page not </span>Found.
				</h1>
				<p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
					Adscrush: Your all-in-one CRM for seamless lead management, tracking, and conversion. Elevate your business with intuitive tools and insights.
				</p>

				<Link
					className={buttonVariants({
						size: "lg",
						className: "mt-5 w-auto",
					})}
					href="/">Go Back to Home <ArrowRight className="ml-2 h-5 w-5" />
				</Link>
			</MaxWidthWrapper>
		</main>

	)
}
