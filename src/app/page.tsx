import { NFTs } from "@/components/NFTs";
import { THIRDWEB_CLIENT } from "@/config";
import { ConnectButton } from "thirdweb/react";

export default function Home() {
	return (
		<div className="flex flex-col w-full pb-28">
			<div className="bg-purple-700 flex flex-row justify-between mb-6 h-12 px-3">
				<div className="my-auto text-white text-2xl">Transfer your POAPs</div>
				<a
					href="https://github.com/thirdweb-example/transfer-poap-nfts"
					target="_blank"
					rel="noreferrer"
					className="my-auto text-white"
				>
					Github
				</a>
			</div>
			<div className="mx-auto">
				<ConnectButton client={THIRDWEB_CLIENT} />
			</div>
			<NFTs />
		</div>
	);
}
