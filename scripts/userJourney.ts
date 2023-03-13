import { ethers } from 'hardhat';

async function main() {
  console.log('Getting signers');

  const [owner, user] = await ethers.getSigners();

  console.log(`Owner: ${owner.address}`);
  console.log(`User: ${user.address}`);

  // GLAM institution staff deploys smart contracts
  // GLAM is acronym for galleries, libraries, archives and museums

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
  console.log('Accepting assets for Album NFT 2');

  await film.connect(user).acceptAsset(2, 0, 1);
  await film.connect(user).acceptAsset(2, 0, 2);
  await film.connect(user).acceptAsset(2, 0, 3);

  console.log(`Active assets of Album NFT 2: ${(await film.getActiveAssets(2)).length}`);
  console.log(`Pending assets of Album NFT 2: ${(await film.getPendingAssets(2)).length}`);

  console.log('Minting Characters NFTs into Album NFTs');

  await character.nestMint(film.address, 1, 3);
  await character.nestMint(film.address, 2, 3);
  await character.nestMint(film.address, 3, 3);

  console.log(`Active child tokens of Album NFT 1: ${(await album.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Album NFT 1: ${(await album.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Album NFT 2: ${(await album.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Album NFT 2: ${(await album.pendingChildrenOf(2)).length}`);
  console.log(`Active child tokens of Album NFT 3: ${(await album.childrenOf(3)).length}`);
  console.log(`Pending child tokens of Album NFT 3: ${(await album.pendingChildrenOf(3)).length}`);

  console.log('Accepting child tokens for Album NFTs');

  await album.acceptChild(1, 0, song.address, 1); // (tokenId, index, childContract, childTokenId)
  await album.acceptChild(1, 0, song.address, 3);
  await album.acceptChild(1, 0, song.address, 2);
  await album.acceptChild(2, 0, song.address, 4);
  await album.acceptChild(2, 0, song.address, 6);
  await album.acceptChild(2, 0, song.address, 5);
  await album.connect(user).acceptChild(3, 0, song.address, 7);
  await album.connect(user).acceptChild(3, 0, song.address, 9);
  await album.connect(user).acceptChild(3, 0, song.address, 8);

  console.log(`Active child tokens of Album NFT 1: ${(await album.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Album NFT 1: ${(await album.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Album NFT 2: ${(await album.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Album NFT 2: ${(await album.pendingChildrenOf(2)).length}`);
  console.log(`Active child tokens of Album NFT 3: ${(await album.childrenOf(3)).length}`);
  console.log(`Pending child tokens of Album NFT 3: ${(await album.pendingChildrenOf(3)).length}`);

  console.log('Adding asset entries to the Song smart contract');

  await song.addAssetEntry('ipfs://audio1');
  await song.addAssetEntry('ipfs://metadata1');
  await song.addAssetEntry('ipfs://lyrics1');
  await song.addAssetEntry('ipfs://audio2');
  await song.addAssetEntry('ipfs://metadata2');
  await song.addAssetEntry('ipfs://lyrics2');
  await song.addAssetEntry('ipfs://audio3');
  await song.addAssetEntry('ipfs://metadata3');
  await song.addAssetEntry('ipfs://lyrics3');

  console.log('Adding assets to the Song NFTs');

  await song.addAssetToTokens([1, 4, 7], [1, 2, 3]);
  await song.addAssetToTokens([2, 5, 8], [4, 5, 6]);
  await song.addAssetToTokens([3, 6, 9], [7, 8, 9]);

  console.log(`Active assets of Song NFT 1: ${(await song.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Song NFT 1: ${(await song.getPendingAssets(1)).length}`);
  console.log(`Active assets of Song NFT 4: ${(await song.getActiveAssets(4)).length}`);
  console.log(`Pending assets of Song NFT 4: ${(await song.getPendingAssets(4)).length}`);
  console.log(`Active assets of Song NFT 7: ${(await song.getActiveAssets(7)).length}`);
  console.log(`Pending assets of Song NFT 7: ${(await song.getPendingAssets(7)).length}`);

  console.log('Accepting assets for the Song NFTs not belonging to the owner');

  await song.connect(user).acceptAsset(7, 0, 1);
  await song.connect(user).acceptAsset(7, 0, 3);
  await song.connect(user).acceptAsset(7, 0, 2);
  await song.connect(user).acceptAsset(8, 0, 4);
  await song.connect(user).acceptAsset(8, 0, 6);
  await song.connect(user).acceptAsset(8, 0, 5);
  await song.connect(user).acceptAsset(9, 0, 7);
  await song.connect(user).acceptAsset(9, 0, 9);
  await song.connect(user).acceptAsset(9, 0, 8);

  console.log(`Active assets of Song NFT 1: ${(await song.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Song NFT 1: ${(await song.getPendingAssets(1)).length}`);
  console.log(`Active assets of Song NFT 4: ${(await song.getActiveAssets(4)).length}`);
  console.log(`Pending assets of Song NFT 4: ${(await song.getPendingAssets(4)).length}`);
  console.log(`Active assets of Song NFT 7: ${(await song.getActiveAssets(7)).length}`);
  console.log(`Pending assets of Song NFT 7: ${(await song.getPendingAssets(7)).length}`);

  console.log('Observing the child-parent relationship');

  console.log(`Children of Album NFT 1: ${await album.childrenOf(1)}`);
  console.log(`Children of Album NFT 2: ${await album.childrenOf(2)}`);
  console.log(`Children of Album NFT 3: ${await album.childrenOf(3)}`);
  console.log(`Parent of Album NFT 1: ${await album.directOwnerOf(1)}`);
  console.log(`Parent of Song NFT 1: ${await song.directOwnerOf(1)}`);
  console.log(`Parent of Song NFT 4: ${await song.directOwnerOf(4)}`);
  console.log(`Parent of Song NFT 7: ${await song.directOwnerOf(7)}`);
  console.log(`Owner of Song NFT 1: ${await song.ownerOf(1)}`);
  console.log(`Owner of Song NFT 4: ${await song.ownerOf(4)}`);
  console.log(`Owner of Song NFT 7: ${await song.ownerOf(7)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
