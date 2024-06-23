import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Hex } from "thirdweb";

export type AcceptedChains = "gnosis" | "ethereum";

export type GenerateURLParams = {
	chain: AcceptedChains;
	contract_addresses: string;
	wallet_addresses: Hex | undefined;
};

export function useOwnedPOAPs(props: GenerateURLParams) {
	return useQuery(
		queryOptions({
			// @ts-ignore - what is this
			queryKey: [props.chain, props.wallet_addresses ?? "n/a"] as const,
			queryFn: async () => {
				if (!props.wallet_addresses) return;
				const url = generateSimpleHashUrl(props);
				const request = await fetch("/api/get-owned-poaps", {
					method: "POST",
					body: JSON.stringify({ url }),
				});
				const response = await request.json();
				return response;
			},
			enabled: !!props.wallet_addresses,
		}),
	);
}

export function generateSimpleHashUrl({
	chain,
	wallet_addresses,
	contract_addresses,
}: GenerateURLParams) {
	const url = new URL("https://api.simplehash.com/api/v0/nfts/owners");
	url.searchParams.append("wallet_addresses", wallet_addresses as Hex);
	url.searchParams.append("chains", chain);
	url.searchParams.append("contract_addresses", contract_addresses);
	return url.toString();
}
