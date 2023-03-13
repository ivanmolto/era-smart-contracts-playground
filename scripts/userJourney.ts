import { ethers } from 'hardhat';

async function main() {
  console.log('Getting signers');

  const [owner, user] = await ethers.getSigners();

  console.log(`Owner: ${owner.address}`);
  console.log(`User: ${user.address}`);

  // GLAM institution staff deploys smart contracts
  // GLAM is acronym for galleries, libraries, archives and museums
  // Use case Pet Projects film and Cat, Dog and Pitch artwork nested NFTs

  console.log('Deploying the smart contracts');

  // By Film we mean Collection - currently there are only films in bookm.art
  const Film = await ethers.getContractFactory('Film');

  // By Character we mean Cast, Extra, Frame, Painting - currently there are only films in bookm.art
  const Character = await ethers.getContractFactory('Character');

  // Showcasing one of our collections
  const film = await Film.deploy('Pet Projects', 'PET', 10_000);
  await film.deployed();

  // Showcasing one of our extras
  const character = await Character.deploy('Cat', 'CAT');
  await character.deployed();

  console.log(`Film smart contract deployed to ${film.address}.`);
  console.log(`Character smart contract deployed to ${character.address}.`);

  console.log('Minting Film NFTs');

  // GLAM staff mints one Film NFT for institution as a reference
  // GLAM staff mints one Film NFT for one visitor whitelisted

  // Visitors can be whitelisted by sharing their public wallet address
  // while acquiring their ticket for an exhibition or by dropping their ENS in a
  // Twitter thread at https://twitter.com/bookm_art

  // film.address = '0x707763458D169673db7Ac5a2a289c1189EdE0413'
  // character.address = '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa'
  // GLAM admin address = '0x531dFB9BAD428988F3A6f0831934379b9c95A1aa'
  // visitor address = '0x8f75415816F8eFEC42a2B46944Da4A261b58b747'

  await film.mint(owner.address, 1);
  await film.mint(user.address, 1);

  console.log(`Film balance of owner: ${await film.balanceOf(owner.address)}`);
  console.log(`Film balance of user: ${await film.balanceOf(user.address)}`);

  // GLAM staff adding asset entries
  console.log('Adding asset entries to the Film smart contract');

  await film.addAssetEntry('ipfs://QmQWoLb2WfYsWUcXfyQcodVEoVbaByWH4WmB5K8CdREVbh');
  await film.addAssetEntry('ipfs://QmW8xbC6aUTHWgSxYykq7jizhzYCbxfsyodkeBa4BqY6Si');
  await film.addAssetEntry('ipfs://QmdXhkjUbbF5KWUv8Kwng6542f4pEamKjmBMi3DVb24e9J');

  // GLAM staff adding assets to tokens
  console.log('Adding assets to the Film NFTs');

  await film.addAssetToTokens([1, 2], 1);
  await film.addAssetToTokens([1, 2], 2);
  await film.addAssetToTokens([1, 2], 3);

  console.log(`Active assets of Film NFT 1: ${(await film.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Film NFT 1: ${(await film.getPendingAssets(1)).length}`);
  console.log(`Active assets of Film NFT 2: ${(await film.getActiveAssets(2)).length}`);
  console.log(`Pending assets of Film NFT 2: ${(await film.getPendingAssets(2)).length}`);

  // Visitor accepting assets for her/his film NFT #2
  console.log('Accepting assets for Film NFT 2');

  await film.connect(user).acceptAsset(2, 0, 1);
  await film.connect(user).acceptAsset(2, 0, 2);
  await film.connect(user).acceptAsset(2, 0, 3);

  console.log(`Active assets of Film NFT 2: ${(await film.getActiveAssets(2)).length}`);
  console.log(`Pending assets of Film NFT 2: ${(await film.getPendingAssets(2)).length}`);

  console.log('Minting Characters NFTs into Film NFTs');

  await character.nestMint('0x707763458D169673db7Ac5a2a289c1189EdE0413', 1, 3);
  await character.nestMint('0x707763458D169673db7Ac5a2a289c1189EdE0413', 2, 3);

  console.log(`Active child tokens of Film NFT 1: ${(await film.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Film NFT 1: ${(await film.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Film NFT 2: ${(await film.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Film NFT 2: ${(await film.pendingChildrenOf(2)).length}`);

  console.log('Accepting child tokens for Film NFTs');

  await film.acceptChild(1, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 1); // (tokenId, index, childContract, childTokenId)
  await film.acceptChild(1, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 3);
  await film.acceptChild(1, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 2);
  await film.connect(user).acceptChild(2, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 4);
  await film.connect(user).acceptChild(2, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 6);
  await film.connect(user).acceptChild(2, 0, '0x7bD7226030630aBAB59D643E04684E4C1d43cfBa', 5);

  console.log(`Active child tokens of Film NFT 1: ${(await film.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Film NFT 1: ${(await film.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Film NFT 2: ${(await film.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Film NFT 2: ${(await film.pendingChildrenOf(2)).length}`);

  console.log('Adding asset entries to the Character smart contract');

  await character.addAssetEntry('ipfs://QmW8xbC6aUTHWgSxYykq7jizhzYCbxfsyodkeBa4BqY6Si');
  await character.addAssetEntry('ipfs://QmQWoLb2WfYsWUcXfyQcodVEoVbaByWH4WmB5K8CdREVbh');
  await character.addAssetEntry('ipfs://QmYf2UKKn7E7CzDUD5xQsxurrNkCTYJLo3cpdz8HF9zTBn');
  await character.addAssetEntry('ipfs://QmW8xbC6aUTHWgSxYykq7jizhzYCbxfsyodkeBa4BqY6Si');
  await character.addAssetEntry('ipfs://QmQWoLb2WfYsWUcXfyQcodVEoVbaByWH4WmB5K8CdREVbh');
  await character.addAssetEntry('ipfs://QmUU87bZbyxwdc7v2t6m7aTexBvqqhiUoeDYWqV2sqzeUL');
  await character.addAssetEntry('ipfs://QmW8xbC6aUTHWgSxYykq7jizhzYCbxfsyodkeBa4BqY6Si');
  await character.addAssetEntry('ipfs://QmQWoLb2WfYsWUcXfyQcodVEoVbaByWH4WmB5K8CdREVbh');
  await character.addAssetEntry('ipfs://QmRXmdHzZZGP5t3LXAEavfNEtRyzJutv4JZ7JC2MmWMKEJ');

  console.log('Adding assets to the Character NFTs');

  await character.addAssetToTokens([1, 4], [1, 2, 3]);
  await character.addAssetToTokens([2, 5], [4, 5, 6]);
  await character.addAssetToTokens([3, 6], [7, 8, 9]);

  console.log(`Active assets of Character NFT 1: ${(await character.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Character NFT 1: ${(await character.getPendingAssets(1)).length}`);
  console.log(`Active assets of Character NFT 4: ${(await character.getActiveAssets(4)).length}`);
  console.log(`Pending assets of Character NFT 4: ${(await character.getPendingAssets(4)).length}`);

  console.log('Accepting assets for the Character NFTs not belonging to the owner');

  await character.connect(user).acceptAsset(4, 0, 1);
  await character.connect(user).acceptAsset(4, 0, 3);
  await character.connect(user).acceptAsset(4, 0, 2);
  await character.connect(user).acceptAsset(5, 0, 4);
  await character.connect(user).acceptAsset(5, 0, 6);
  await character.connect(user).acceptAsset(5, 0, 5);
  await character.connect(user).acceptAsset(6, 0, 7);
  await character.connect(user).acceptAsset(6, 0, 9);
  await character.connect(user).acceptAsset(6, 0, 8);

  console.log(`Active assets of Character NFT 1: ${(await character.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Character NFT 1: ${(await character.getPendingAssets(1)).length}`);
  console.log(`Active assets of Character NFT 4: ${(await character.getActiveAssets(4)).length}`);
  console.log(`Pending assets of Character NFT 4: ${(await character.getPendingAssets(4)).length}`);

  console.log('Observing the child-parent relationship');

  console.log(`Children of Film NFT 1: ${await film.childrenOf(1)}`);
  console.log(`Children of Film NFT 2: ${await film.childrenOf(2)}`);
  console.log(`Parent of Film NFT 1: ${await film.directOwnerOf(1)}`);
  console.log(`Parent of Character NFT 1: ${await character.directOwnerOf(1)}`);
  console.log(`Parent of Character NFT 4: ${await character.directOwnerOf(4)}`);
  console.log(`Owner of Character NFT 1: ${await character.ownerOf(1)}`);
  console.log(`Owner of Character NFT 4: ${await character.ownerOf(4)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
