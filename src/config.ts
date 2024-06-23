import { createThirdwebClient } from "thirdweb";

// Airdrop contract address on Gnosis Safe chain
export const AIRDROP_GNOSIS_SAFE = "0x8F23DF41072187D85DbfF32669bC247fb9a7866B"; // replace this with your own Airdrop contract address

// Airdrop contract address on Ethereum mainnet
export const AIRDROP_ETH_MAINNET = "";

// POAP contract address on Gnosis
export const POAP_ADDRESS_GNOSIS = "0x22C1f6050E56d2876009903609a2cC3fEf83B415"; // do not change this value

// POAP contract address on Ethereum mainnet
export const POAP_ADDRESS_MAINNET =
	"0x22c1f6050e56d2876009903609a2cc3fef83b415"; // do not change this value

export const THIRDWEB_CLIENT = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});
