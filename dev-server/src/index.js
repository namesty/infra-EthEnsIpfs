import { deployENS } from "./ens/deployENS";

const Web3 = require("web3");
const express = require("express");

const getWeb3 = () => {
  return new Web3(
    new Web3.providers.HttpProvider(`http://localhost:8545`)
  );
}

const app = express();
const router = express.Router();

let addresses = { };

// Simple logging
router.use((req, res, next) => {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

router.get('/providers', (req, res) => {
  res.send({
    ipfs: `http://localhost:5001`,
    ethereum: `http://localhost:8545`
  });
});

router.get('/ens', (req, res) => {
  res.send({
    ensAddress: addresses.ensAddress
  });
});

router.get('/deploy-ens', async (req, res) => {
  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();
  addresses = await deployENS(web3, accounts);

  res.send(addresses);
});

router.get('/status', (req, res) => {
  res.send({
    running: true
  });
});

app.use('/', router);
app.listen(4040, () => {
  console.log(`dev-server now listening on port 4040...`);
});
