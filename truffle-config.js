const fs = require("fs");
require("dotenv").config();
const { MNEMONIC, PROJECT_KEY } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    inf_Lottery_goerli: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `wss://goerli.infura.io/ws/v3/${PROJECT_KEY}`
        ),
      networkCheckTimeout: 10000,
      network_id: 5, // Goerli's id
      gas: 4465030, // Goerli has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "0.8.16",
    },
  },
};
