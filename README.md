# Transfer your POAP NFTs with thirdweb

![image](https://github.com/thirdweb-example/transfer-poap-nfts/assets/26052673/a1669ee9-fb1a-4a98-aea9-cd24f3ad0aef)

important: If you want to transfer the POAPs in bulk, you need to deploy your own Airdrop contract: https://thirdweb.com/thirdweb.eth/Airdrop/2.0.0
on Gnosis and/or Ethereum mainnet (depends on where your POAPs at) - to be able to use this app.  

Create a `.env.local` file at the root level and add this content:  

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=""
SIMPLEHASH_API_KEY=""
```

In the file `src/config.ts`, if you need to transfer the POAPs in bulk, you have to deploy a thirdweb Airdrop contract using the wallet that has the POAP.  

Once you have the Airdrop contract address, put it in here:

```typescript
// Airdrop contract address on Gnosis Safe chain
export const AIRDROP_GNOSIS_SAFE = "0x8F23DF41072187D85DbfF32669bC247fb9a7866B";

// Airdrop contract address on Ethereum mainnet
export const AIRDROP_ETH_MAINNET = "";
```

Keep in mind that you should only deploy an airdrop contract if you really need it. For example, if your POAPs are on Gnosis (xDAI), then you don't have to deploy an Airdrop contract on Mainnet Ethereum.