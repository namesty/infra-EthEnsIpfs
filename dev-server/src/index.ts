import { deployENS } from "./ens/deployENS";

import express from "express";
import { ethers} from "ethers";

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
  res.send(addresses);
});

router.get('/status', (req, res) => {
  res.send({
    running: true
  });
});

app.use('/', router);

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ganache ? 
    `http://${process.env.ganache}`: `http://localhost:8545`
  )
  console.log("Waiting for RPC node...")
  
  await provider.ready

  addresses = await deployENS(provider);

  app.listen(4040, async () => {
    console.log(`dev-server now listening on port 4040...`);
  });
})()
