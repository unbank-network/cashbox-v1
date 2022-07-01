import hre from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));
  const ContractName = "DeployFactory";

  const DeployFactory = await hre.ethers.getContractFactory(ContractName);
  const factory = await DeployFactory.deploy();
  console.log(`${ContractName} deployed to:`, factory.address);

  if (!deployments[ContractName]) deployments[ContractName] = [];
  deployments[ContractName].push(factory.address);
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await factory.deployTransaction.wait(20);
  await verifyContract(factory.address, []);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
