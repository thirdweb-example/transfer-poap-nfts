"use client";

import {
	AIRDROP_GNOSIS_SAFE,
	POAP_ADDRESS_GNOSIS,
	POAP_ADDRESS_MAINNET,
	THIRDWEB_CLIENT,
} from "@/config";
import { useOwnedPOAPs, type AcceptedChains } from "@/useOwnedPOAPs";
import { useState } from "react";
import {
	defineChain,
	getContract,
	sendAndConfirmTransaction,
	type Hex,
} from "thirdweb";
import { airdropERC721 } from "thirdweb/extensions/airdrop";
import {
	useActiveAccount,
	useActiveWalletChain,
	useSwitchActiveWalletChain,
} from "thirdweb/react";
import {
	isApprovedForAll,
	setApprovalForAll,
	transferFrom,
} from "thirdweb/extensions/erc721";

const CHAINS: Array<{
	value: AcceptedChains;
	label: string;
	chainId: number;
	poapContractAddress: Hex;
	airdropContractAddress: Hex;
}> = [
	{
		value: "gnosis",
		label: "Gnosis (xDAI)",
		chainId: 100,
		poapContractAddress: POAP_ADDRESS_GNOSIS,
		airdropContractAddress: AIRDROP_GNOSIS_SAFE,
	},
	{
		value: "ethereum",
		label: "Ethereum Mainnet",
		chainId: 1,
		poapContractAddress: POAP_ADDRESS_MAINNET,
		airdropContractAddress: POAP_ADDRESS_MAINNET,
	},
];

export function NFTs() {
	const [activeTab, setActiveTab] = useState<number>(0);
	const switchChain = useSwitchActiveWalletChain();
	const activeChain = useActiveWalletChain();
	const account = useActiveAccount();

	const selectedItem = CHAINS[activeTab];

	const { data, isLoading } = useOwnedPOAPs({
		contract_addresses: selectedItem.poapContractAddress,
		wallet_addresses: account?.address,
		chain: selectedItem.value,
	});

	const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

	const nfts = data ? data.nfts : [];

	const [open, setOpen] = useState(false);

	const [recipient, setRecipient] = useState<string>("");

	const [isTransferring, setTransferring] = useState(false);

	const handleTabClick = (tab: number) => {
		setActiveTab(tab);
	};
	return (
		<>
			<div className="max-w-3xl mx-auto mt-8">
				{/* Tab Headers */}
				<div className="flex border-b">
					{CHAINS.map((item, index) => (
						<button
							key={item.value}
							type="button"
							className={`tab-button px-4 py-2 -mb-px text-gray-700 border-b-2 focus:outline-none ${activeTab === index ? "border-blue-500 text-blue-500" : "border-transparent hover:border-gray-400"}`}
							onClick={() => handleTabClick(index)}
						>
							{item.label}
						</button>
					))}
				</div>

				{account ? (
					<>
						{isLoading ? (
							<div className="mt-3 mx-auto text-center">Loading...</div>
						) : (
							<>
								{nfts.length === 0 ? (
									<div className="mt-3 mx-auto text-center">
										You have no POAP on this chain
									</div>
								) : (
									<div className="mx-auto flex flex-row flex-wrap mt-8 max-w-[580px] justify-evenly">
										{/* biome-ignore lint/suspicious/noExplicitAny: need to update types from SImplehash but im lazy and we will be replacing simplehash with our indexer anyway */}
										{nfts.map((item: any) => (
											// biome-ignore lint/a11y/useKeyWithClickEvents: FIXME
											<div
												key={item.token_id}
												className={`flex flex-col cursor-pointer backdrop-blur mt-3 border-2 p-2 rounded-lg gap-2 opacity-75 hover:opacity-100 ${selectedTokenIds.includes(item.token_id) ? "opacity-100 border-green-600" : "opacity-75"}`}
												onClick={() => {
													let arr = [];
													if (selectedTokenIds.includes(item.token_id)) {
														arr = selectedTokenIds.filter(
															(o) => o !== item.token_id,
														);
													} else {
														arr = selectedTokenIds.concat([item.token_id]);
													}
													setSelectedTokenIds(arr);
												}}
											>
												<img
													src={item.image_url}
													width={"120px"}
													height={"120px"}
													className="rounded-full"
													alt=""
												/>
												<div className="max-w-[120px] overflow-hidden text-xs h-[50px] text-center">
													{item.name}
												</div>
											</div>
										))}
									</div>
								)}
							</>
						)}
					</>
				) : (
					<div className="mx-auto text-center mt-3">Connect your wallet</div>
				)}
			</div>

			{selectedTokenIds.length > 0 && account && (
				<div
					className={`fixed bottom-0 left-0 bg-purple-700 w-full text-white flex p-2 ${open ? "h-64 flex-col" : "h-16 flex-row flex-wrap justify-center gap-3"}`}
				>
					{!open ? (
						<>
							<div className="my-auto">
								{selectedTokenIds.length} items selected.
							</div>
							<button
								type="button"
								className="bg-white text-black rounded px-3 py-2"
								onClick={() => {
									if (!selectedItem.airdropContractAddress) {
										return alert("Missing airdrop contract for this chain");
									}
									setOpen(true);
								}}
							>
								Transfer
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								className="rotate-45 text-3xl font-bold ml-auto"
								onClick={() => setOpen(false)}
							>
								+
							</button>
							<div className="mx-auto text-center">
								{selectedTokenIds.length} items selected.
							</div>
							<div className="mx-auto mt-5 lg:w-[400px]">
								<div className="text-center">Transfer to</div>
								<input
									type="text"
									placeholder="0x..."
									className="rounded-lg px-3 ly-1 bg-transparent border-2 border-white"
									// FIXME Need proper validation for this value
									onChange={(e) => setRecipient(e.target.value)}
								/>
							</div>
							<div className="mx-auto mt-3">
								{/* FIXME Need to check for token approval first */}
								<button
									className="bg-white text-black px-3 py-2 rounded-lg"
									type="button"
									onClick={async () => {
										setTransferring(true);
										try {
											if (!account?.address) return;
											const chain = defineChain(selectedItem.chainId);
											if (activeChain?.id !== chain.id) {
												await switchChain(chain);
											}
											const poapContract = getContract({
												address: selectedItem.poapContractAddress,
												client: THIRDWEB_CLIENT,
												chain,
											});
											/**
											 * If user only wants to transfer one item,
											 * then we don't have to use the Airdrop contract
											 */
											if (selectedTokenIds.length === 1) {
												const transaction = transferFrom({
													contract: poapContract,
													tokenId: BigInt(selectedTokenIds[0]),
													from: account.address,
													to: recipient as Hex,
												});
												const receipt = await sendAndConfirmTransaction({
													transaction,
													account,
												});
												setTransferring(false);
												setOpen(false);
												setSelectedTokenIds([]);
												return alert(
													`Sent. Tx Hash: ${receipt.transactionHash}`,
												);
											}

											if (!selectedItem.airdropContractAddress) {
												throw new Error(
													"No airdrop contract found. please read the README",
												);
											}

											const airdropContract = getContract({
												address: selectedItem.airdropContractAddress,
												chain,
												client: THIRDWEB_CLIENT,
											});

											const isApproved = await isApprovedForAll({
												contract: poapContract,
												owner: account.address,
												operator: airdropContract.address as Hex,
											});

											if (!isApproved) {
												const approveTx = setApprovalForAll({
													contract: poapContract,
													operator: airdropContract.address as Hex,
													approved: true,
												});

												await sendAndConfirmTransaction({
													transaction: approveTx,
													account,
												});
											}

											const contents = selectedTokenIds.map((tokenId) => ({
												recipient: recipient as Hex,
												tokenId: BigInt(tokenId),
											}));

											const transaction = airdropERC721({
												contents,
												contract: airdropContract,
												tokenAddress: selectedItem.poapContractAddress,
											});

											const receipt = await sendAndConfirmTransaction({
												transaction,
												account,
											});
											alert(`Sent. Tx hash: ${receipt.transactionHash}`);
										} catch (err) {
											console.error(err);
											alert(err);
										}
										setTransferring(false);
										setOpen(false);
										setSelectedTokenIds([]);
									}}
								>
									{isTransferring ? "Loading..." : "Transfer"}
								</button>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
}
