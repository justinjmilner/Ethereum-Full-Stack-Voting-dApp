import {ethers} from "ethers";
import { Lottery__factory } from "../typechain-types"
import * as dotenv from "dotenv";
import { Console } from "console";
import { formatEther } from "ethers/lib/utils";
dotenv.config()

const TOKENCONT="0xFC892E2Bb534724613C4444d1D901A728f1eA516"

const BET_PRICE = 1;
const BET_FEE = 0.2;
// const TOKEN_RATIO = 1;
const NAME = "Lottery Crazy Token";
const SYMBOL = "LCT";
const PURCHASE_RATIO = 50;

async function main () {
    // const provider = ethers.getDefaultProvider()
const provider = new ethers.providers.InfuraProvider("goerli", {infura: process.env.INFURA_API_KEY});
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ??"");
const signer = wallet.connect(provider);
console.log(`wallet ${signer.address}`)

const lotteryContractFactory = new Lottery__factory(signer);
// const lotteryContract = await lotteryContractFactory.deploy(
//   NAME,
//     SYMBOL,
//     PURCHASE_RATIO,
//     ethers.utils.parseEther(BET_PRICE.toFixed(18)),
//     ethers.utils.parseEther(BET_FEE.toFixed(18))
// );
const lotteryContract = lotteryContractFactory.attach(TOKENCONT)
// await lotteryContract.deployed()
// const hashdeploy= lotteryContract.deployed()
// console.log(`address new contract ${(await (hashdeploy)).address} `)

const bestOpen = await lotteryContract.betsOpen()
console.log(bestOpen)

// const betMany = await lotteryContract.betMany(1)
// console.log(((`betMany, ${betMany.hash}`)))

const betPrice = await lotteryContract.betPrice()
console.log(parseFloat(formatEther(betPrice)))

const owner = await lotteryContract.owner()
console.log((`Owner is ${owner}`))

const betFee = await lotteryContract.betFee()
console.log(parseFloat(formatEther(betFee)))

// const openBets = await lotteryContract.openBets()
// console.log((formatEther(openBets)))

// const betsClosingTime = await lotteryContract.betsClosingTime()
// console.log((formatEther(betsClosingTime)))

const randomNumber = await lotteryContract.getRandomNumber()
console.log(((`randomNumber: ${randomNumber}`)))

const ownerPool = await lotteryContract.ownerPool()
console.log(((`ownerPool: ${ownerPool}`)))

const prizeWithdraw = await lotteryContract.prizeWithdraw(0)
console.log(((`prizeWithdraw: ${prizeWithdraw.hash}`)))

const prizePool = await lotteryContract.prizePool()
console.log((formatEther(prizePool)))

// const purchaseTokens = await lotteryContract.purchaseTokens()
// console.log(((`purchase token hash ${purchaseTokens.hash}`)))

// const closeLottery = await lotteryContract.closeLottery()
// console.log(((`close hash  ${closeLottery.hash}`)))



const balance = await signer.getBalance();
console.log(`this address has balance of ${balance}`)



}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});