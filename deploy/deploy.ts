import { delay } from '@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { run } from 'hardhat';
import { Film, Character } from '../typechain-types';
import { Wallet, utils } from 'zksync-web3';
import * as ethers from 'ethers';

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log('Deploying smart film contract');

  const wallet = new Wallet(process.env.PRIVATE_KEY || '');

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const filmArtifact = await deployer.loadArtifact('Film');
  const filmArgs = ['Pet Projects', 'PET', 10_000];
  // const filmArgs = ['Charge', 'CHARGE', 10_000];
  // const filmArgs = ['Sprite Fright', 'SPRITE', 10_000];
  // const filmArgs = ['Coffee Run', 'COFFEE', 10_000];
  // const filmArgs = ['Spring', 'SPRING', 10_000];
  // const filmArgs = ['Caminandes Llamigos', 'CAMINANDES', 10_000];

  // Estimate contract deployment fee
  const filmDeploymentFee = await deployer.estimateDeployFee(filmArtifact, filmArgs);

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const parsedFee = ethers.utils.formatEther(filmDeploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const film = <Film>await deployer.deploy(filmArtifact, filmArgs);

  await film.deployed();

  console.log(`Sample contracts deployed to ${film.address}.`);

  await delay(20000);
  console.log('Will verify now');

  await run(`verify:verify`, {
    address: film.address,
    constructorArguments: filmArgs,
    contract: 'contracts/Film.sol:Film',
  });
}
