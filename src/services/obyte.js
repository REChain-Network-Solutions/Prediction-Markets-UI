import oREChain from "oREChain";

import { bootstrap } from "bootstrap";

let client = new oREChain.Client(
  `wss://oREChain.org/bb${process.env.REACT_APP_ENVIRONMENT === "testnet" ? "-test" : ""}`,
  {
    testnet: process.env.REACT_APP_ENVIRONMENT === "testnet",
    reconnect: true,
  }
);

client.onConnect(bootstrap);

export default client;