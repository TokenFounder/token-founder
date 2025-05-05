export const baseNameTemplate = `Given the recent messages, extract the following information about the requested buy BaseName.

Example response:
\`\`\`json
{
    "basename": "aiqubit.base.eth"
}
\`\`\`

{{recentMessages}}

Extract the following information about the requested buy BaseName:

- Base name string

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
`;

export const transferTokenTemplate = `Given the recent messages, extract the following information about the requested token transfer.

Example response:
\`\`\`json
{
    "recipient": "0x67e2c2e6186ae9Cc17798b5bD0c3c36Ef0209aC9",
    "amount": "1"
}
\`\`\`

{{recentMessages}}

Extract the following information about the requested transfer token:

- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
`;

export const deployTokenTemplate = `Given the recent messages, extract the following information about the requested deploy Token.

Example response:
\`\`\`json
{
    "name:" "TokenFounder",
    "symbol": "TFT",
    "decimals": 9,
    "initialSupply": "100000000",
}
\`\`\`

{{recentMessages}}

Extract the following information about the requested token deployment:

- Token Name
- Token Symbol
- Token Decimals
- Token Initial Supply

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
`;

export const deployNonFungibleTokenTemplate = `Given the recent messages, extract the following information about the requested deploy NFT.

Example response:
\`\`\`json
{
    "name:" "NonFungibleTokenFounder",
    "symbol": "NFTF",
    "url": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
}
\`\`\`

{{recentMessages}}

Extract the following information about the requested nft deployment:

- NFT Name
- NFT Symbol
- NFT URL

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
`;
