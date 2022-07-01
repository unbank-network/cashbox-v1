import hre from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";
import { numToWei } from "../utils/utils";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));

  // DeployFactory contract address
  const factoryAddress = "0xEecE5be8856E52A0514f44b42261fC988957bFD8";

  // Set createCashBox() arguments
  const params = {
    cashTokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    assetTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    assetToCashRate: numToWei(1, 18),
    cashCap: numToWei(10000, 18),
    name: "TCashBox TREIT",
    symbol: "TCB-2"
  };

  const cashboxFactory = await hre.ethers.getContractAt(
    "DeployFactory",
    factoryAddress
  );

  console.log("Calling createCashBox() with params:", params);
  const tx = await cashboxFactory.createCashBox(
    params.cashTokenAddress,
    params.assetTokenAddress,
    params.assetToCashRate,
    params.cashCap,
    params.name,
    params.symbol
  );

  console.log("txn:", tx.hash);

  const boxes: any[] = await cashboxFactory.getAllCashBoxes();
  const deployedCashboxAddress = boxes[boxes.length - 1];

  console.log("Deployed a new Cashbox:", deployedCashboxAddress);
  console.log("List of all Cashboxes:", boxes);

  if (!deployments.Cashboxes) deployments.Cashboxes = [];
  deployments.Cashboxes.push(deployedCashboxAddress);
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await tx.wait(20);

  await verifyContract(deployedCashboxAddress, [
    params.cashTokenAddress,
    params.assetTokenAddress,
    params.assetToCashRate,
    params.cashCap,
    params.name,
    params.symbol,
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
