import hre from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";
import { numToWei } from "../utils/utils";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));

  // Set cashbox creation arguments
  const params = {
    cashTokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    assetTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    assetToCashRate: numToWei(1, 18),
    cashCap: numToWei(10000, 18),
    name: "CashBox Test",
    symbol: "TCB1"
  };

  const Cashbox = await hre.ethers.getContractFactory("StockLiquiditator");

  console.log("Deploying Cashbox V1 with params:", params);

  const cashbox = await Cashbox.deploy(
    params.cashTokenAddress,
    params.assetTokenAddress,
    params.assetToCashRate,
    params.cashCap,
    params.name,
    params.symbol
  );
  console.log("Deployed a new Cashbox:", cashbox.address);

  if (!deployments.Cashboxes) deployments.Cashboxes = [];
  deployments.Cashboxes.push(cashbox.address);
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await cashbox.deployTransaction.wait(20);
  await verifyContract(cashbox.address, [
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
