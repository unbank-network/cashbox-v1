import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  solidity: {
    version: "0.5.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORK_URL || "https://polygon-rpc.com",
      },
    },
    mumbai: {
      url: process.env.MUMBAI_RPC || "https://rpc-mumbai.matic.today",
      accounts: [process.env.TEST_PRIVATE_KEY],
    },
    polygon: {
      url: process.env.POLYGON_RPC || "https://polygon-rpc.com",
      accounts: [process.env.MAIN_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
