import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { WalletService } from 'src/services/WalletService';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/TokenizedBallot.json';

declare var window: any;

const tokenAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const ballotAddress = '0xf185087be41f7ae83690998f97c8c512b3a55f00';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;
 
  votePower: number | undefined;
  winnerName: string | undefined;

  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;
  

 constructor(private http: HttpClient) {

  }
  createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.http.get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
      this.tokenContractAddress = ans.result;
      if (this.tokenContractAddress && this.wallet) {
        this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet)
        this.wallet.getBalance().then((balanceBN) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract['balanceOf'](this.wallet.address).then(
          (tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        });
        this.tokenContract['getVotes'](this.wallet.address).then(
          (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(
            ethers.utils.formatEther(votePowerBn)
          );
        });
        this.http.get<any>("http://localhost:3000/ballot-address")
        .subscribe((ans) => {
          this.ballotContractAddress = ans.result;
        });
      }
    });
  }
  
  vote(voteId: string){
    console.log("Voting in progress for account: " + voteId);
    this.http.get<any>("http://localhost:3000/ballot-address")
    .subscribe((ans) => {
      this.ballotContractAddress = ans.result;

      if(this.ballotContractAddress && this.wallet) {
        console.log("Creating Ballot contract instance");
        this.ballotContract = new ethers.Contract(this.ballotContractAddress, ballotJson.abi, this.wallet);
        console.log("Post request to cast vote in progress...");
        this.http.post<any>("http://localhost:3000/cast-vote", {
          voterAddress: this.wallet?.address,
          proposal: voteId,
          tokenAmount: "1"
        })
        .subscribe((ans) => {
          console.log(ans.result);
        });
        this.http.get<any>("http://localhost:3000/winning-proposal")
        .subscribe((ans) => {
          console.log(`winner is: ${ans.result}`);
          this.winnerName = ans.result;
        });
      }
    })
  }

  request(tokenAmount: string) {
    this.http.post<any>("http://localhost:3000/request-tokens", {
      mintToAddress: this.wallet?.address,
      tokenAmnt: tokenAmount
    })
    .subscribe((ans) => {
      console.log(ans);
    });
  }
}
