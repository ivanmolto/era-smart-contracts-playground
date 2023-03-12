# BOOKM.ART SMART CONTRACTS

## Introduction

The most beautiful, powerful and intriguing objects have one thing in common: they live in galleries, libraries, archives, and museums (GLAM). All of them are institutions that collect and maintain cultural heritage materials in the public interest.

bookm.art is an open source platform powering the GLAM sector with richer digital experiences for their visitors on site and online using the NFT technology from [RMRK](https://www.rmrk.app) built on [zkSync Era](https://zksync.io).

bookm.art explores an innovative way of sharing stories and collections of content using the multi-asset and nested NFT smart contract implementations by the RMRK Team. From now the stories can be about a single object or a wider collection, but they always have a strong visual narrative by binding assets such as images, audio, video files and other NFTs.

Some of the benefits of nested and multi-assets NFTs for the GLAM sector are:

- Feature content collections, previews of exhibitions, or virtual tours.
- Promote perks and authenticity.
- Create a digital gift for someone you care about.
- Ensure more emotional, personal, and playful encounter with art.
- Create an improved NFT experience compared with ERC721 and ERC1125 alone.

Credit and kudos to RMRK Team.

## Set up instructions

1. Install packages with `yarn` or `npm i`
2. Check contract size: `yarn hardhat size-contracts`
3. Run prettier: `yarn prettier`
4. Copy .env.example into .env and set the variables
5. Use `contracts/`, `tests/` and `scripts/` to build the code.
6. Use `yarn hardhat compile` to compile the code.
7. Deploy on testnet: `yarn hardhat deploy-zksync --network zkSyncTestnet`

## Using Nestable and MultiAsset RMRK legos in bookm.art

bookm.art shows how the Nestable and MultiAsset RMRK legos are used to create a richer digital/NFT experience in galleries, libraries, archives, and museums.

## Use Case

The use case that bookm.art implements is a film/collection (exhibiton, catalog, etc...).

The film will be a collection of NFTs, each representing characters, extras,...

Each Film/Collection will be represented by an image, metadata, video and/or audio files.

And Each Character/Extra will be represented by an image and metadata.

The Film/Collection NFT will live in its own collection, while the Characters/Extras will live in their own collection.

![](01-frontend-collection-details.jpg)

## Smart Contracts

Here you will find the smart contracts for Film and Character.

<details>
    <summary>Click to see the full code of the Film smart contract</summary>

        // SPDX-License-Identifier: Apache-2.0

        pragma solidity ^0.8.18;

        import "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";
        import "@openzeppelin/contracts/access/Ownable.sol";

        error MintOverMaxSupply();
        error ZeroAddress();
        error ZeroAmount();

        contract Film is RMRKNestableMultiAsset, Ownable {
        uint256 public totalSupply;
        uint256 public maxSupply;
        uint64 public numberOfAssets;

            constructor(
                string memory name_,
                string memory symbol_,
                uint256 maxSupply_
            ) RMRKNestableMultiAsset(name_, symbol_) {
                maxSupply = maxSupply_;
            }

            function mint(address to, uint256 amount) public onlyOwner {
                if (amount == 0) revert ZeroAmount();
                if (to == address(0)) revert ZeroAddress();
                if (totalSupply + amount > maxSupply) revert MintOverMaxSupply();

                uint256 nextTokenId = totalSupply + 1;
                unchecked {
                    totalSupply += amount;
                }
                uint256 totalSupplyOffset = totalSupply + 1;

                for (uint256 i = nextTokenId; i < totalSupplyOffset; ) {
                    _safeMint(to, i, "");
                    unchecked {
                        i++;
                    }
                }
            }

            function AddAssetEntry(string memory metadataURI) public onlyOwner {
                unchecked {
                    numberOfAssets++;
                }
                _addAssetEntry(numberOfAssets, metadataURI);
            }

            function AddAssetToTokens(
                uint256[] memory tokenIds,
                uint64 assetId
            ) public onlyOwner {
                for (uint256 i = 0; i < tokenIds.length; ) {
                    _addAssetToToken(tokenIds[i], assetId, 0);

                    if (ownerOf(tokenIds[i]) == msg.sender) {
                        uint256 assetIndex = getPendingAssets(tokenIds[i]).length - 1;
                        acceptAsset(tokenIds[i], assetIndex, assetId);
                    }
                    unchecked {
                        i++;
                    }
                }
            }

        }

</details>

<details>
    <summary>And click to see the full code of the Character smart contract</summary>

        // SPDX-License-Identifier: Apache-2.0
        pragma solidity ^0.8.18;

        import "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";
        import "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulbound.sol";
        import "@openzeppelin/contracts/access/Ownable.sol";

        error DestinationZeroAddress();
        error DestinationIdZero();
        error AmountZero();

        contract Character is RMRKNestableMultiAsset, RMRKSoulbound, Ownable {
            uint256 public totalSupply;
            uint64 public numberOfAssets;

            constructor(
                string memory name_,
                string memory symbol_
            ) RMRKNestableMultiAsset(name_, symbol_) {}

            function nestMint(
                address to,
                uint256 destinationId,
                uint256 amount
            ) public onlyOwner {
                if (to == address(0)) revert DestinationZeroAddress();
                if (destinationId == 0) revert DestinationIdZero();
                if (amount == 0) revert AmountZero();

                uint256 nextTokenId = totalSupply + 1;
                unchecked {
                    totalSupply += amount;
                }
                uint256 totalSupplyOffset = totalSupply + 1;

                for (uint256 i = nextTokenId; i < totalSupplyOffset; ) {
                    _nestMint(to, i, destinationId, "");
                    unchecked {
                        i++;
                    }
                }
            }

            function addAssetEntry(string memory metadataURI) public onlyOwner {
                unchecked {
                    numberOfAssets++;
                }
                _addAssetEntry(numberOfAssets, metadataURI);
            }

            function addAssetToTokens(
                uint256[] memory tokenIds,
                uint64[] memory assetIds
            ) public onlyOwner {
                for (uint256 i = 0; i < tokenIds.length; ) {
                    for (uint256 j = 0; j < assetIds.length; ) {
                        _addAssetToToken(tokenIds[i], assetIds[j], 0);

                        if (ownerOf(tokenIds[i]) == msg.sender) {
                            uint256 assetIndex = getPendingAssets(tokenIds[i]).length -
                                1;
                            acceptAsset(tokenIds[i], assetIndex, assetIds[j]);
                        }

                        unchecked {
                            j++;
                        }
                    }

                    unchecked {
                        i++;
                    }
                }
            }

            function _beforeTokenTransfer(
                address from,
                address to,
                uint256 tokenId
            ) internal override(RMRKCore, RMRKSoulbound) {
                RMRKSoulbound._beforeTokenTransfer(from, to, tokenId);
            }

            function supportsInterface(
                bytes4 interfaceId
            )
                public
                view
                override(RMRKSoulbound, RMRKNestableMultiAsset)
                returns (bool)
            {
                return
                    RMRKSoulbound.supportsInterface(interfaceId) ||
                    super.supportsInterface(interfaceId);
            }
        }

</details>

You can see the code for the Film and Character smart contracts in the contracts folder and [here](https://github.com/ivanmolto/era-smart-contracts-playground/blob/zksync/contracts/Film.sol) and [here](https://github.com/ivanmolto/era-smart-contracts-playground/blob/zksync/contracts/Character.sol)

## Deployment of smart contracts

We will creat a `deploy.ts` file ini the `deploy` directory to write the deployment script.
You can find the deployment script [here](https://github.com/ivanmolto/era-smart-contracts-playground/blob/zksync/deploy/deploy.ts)

These are the smart contracts deployed for the sample collections in https://www.bookm.art:

### Pet Projects

Name: Pet Projects
Symbol: PET
Max supply: 10000
Contract address: 0x707763458D169673db7Ac5a2a289c1189EdE0413
Verification code: 4421
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0x707763458D169673db7Ac5a2a289c1189EdE0413)

metadataURI: ipfs://QmQWoLb2WfYsWUcXfyQcodVEoVbaByWH4WmB5K8CdREVbh
tokenURI: ipfs://QmW8xbC6aUTHWgSxYykq7jizhzYCbxfsyodkeBa4BqY6Si
spoilerURI: ipfs://QmdXhkjUbbF5KWUv8Kwng6542f4pEamKjmBMi3DVb24e9J

### Charge

Name: Charge
Symbol: CHARGE
Max supply: 10000
Contract address: 0xc2E38E19e5Da9b239AB0A317A0214aEdA702B235
Verification code: 4407
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0xc2E38E19e5Da9b239AB0A317A0214aEdA702B235)

metadataURI: ipfs://QmZ1xvtu9VzZxQzkGZx88Mj1pCNQAzAUdpyB6d7PkmBhc7
tokenURI: ipfs://QmTcNwoisU3rzgubRrLrWKZyGB8LLg8qCKyEj41xWwPL7y
teaserURI: ipfs://QmUoGSdHj8aZmWPHfpUqC8yRMuktTCfAxzWiN9hsHroG66

### Sprite Fright

Name: Sprite Fright
Symbol: SPRITE
Max supply: 10000
Contract address: 0x8380707688b09F16606ac606E9C3E14cA5B9B5A4
Verification code: 4408
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0x8380707688b09F16606ac606E9C3E14cA5B9B5A4)

metadataURI: ipfs://QmRuHCGEZWCXAu5BKEj7VaFArzdxzMTAs3NKRJr8n11jBA
tokenURI: ipfs://QmcRTF6zg66N5pceWhfib5hoEhXq6DYTAfdyMnGBtdo8Ct
lineupURI: ipfs://QmepXTjE1SUtWnFQxhPEb5nwrkcjXqSMCUs4o28yf4DB8V

### Spring

Name: Spring
Symbol: SPRING
Max supply: 10000
Contract address: 0x73713d7aa41B8E8bA3fd2834D14D5e0eAFA31242
Verification code: 4413
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0x73713d7aa41B8E8bA3fd2834D14D5e0eAFA31242)

metadataURI: ipfs://QmQkSHewktWop2EuyQ8tsQoNw7JZBudyCFaMswno4MXrAi
tokenURI: ipfs://QmRdwxGqdSjKE4zHFy3upXpqZxCnSqogUfzMAjDzeQxGCi
videoURI: ipfs://QmUPAsc2p3tgbt3ScnnB9MJ799zcCnbBYwsarYvQKxNruM

### Caminandes Llamigos

Name: Caminandes Llamigos
Symbol: CAMINANDES
Max supply: 10000
Contract address: 0xba832BfC947C2fD418359b9d42Be74C6AFcD1848
Verification code: 4414
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0xba832BfC947C2fD418359b9d42Be74C6AFcD1848)
(In progress)

### Coffee Run

Name: Coffee Run
Symbol: COFFEE
Max supply: 10000
Contract address: 0x8b23aA87448b848462d1Ed290a30515Fd106c812
Verification code: 4412
zkSync Era Explorer: [link](https://goerli.explorer.zksync.io/address/0x8b23aA87448b848462d1Ed290a30515Fd106c812)
(In progress)

## User Journey
