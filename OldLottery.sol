// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from './Token.sol';

contract OldLottery is Ownable {
    LotteryToken public paymentToken;
        uint256 public betPrice;
        uint256 public purchaseRatio;
        uint256 public closingTimeStamp;
        uint256 public betFee;

        uint256 public ownerPool;
        uint256 public prizePool;
        mapping (address => uint256 ) prize;

        bool public betsOpen;

        address[] private slots;

    constructor(string memory name, string memory symbol, uint256 _purchaseRatio, uint256 _betPrice, uint256 _betFee) {
        paymentToken = new LotteryToken(name, symbol);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;
    }

    function openBets(uint256 _closingTimeStamp) external onlyOwner {
        require(!betsOpen,"The bets are already open!");
        require(closingTimeStamp > block.timestamp, "The closing time must be in the future!");
        closingTimeStamp = _closingTimeStamp;
        betsOpen = true;
    }

    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio );
    }
    function betMany(uint256 times) external {
        while (times > 0 ) {
            times--;
            bet();
        }
    }
    function bet() public onlyWhenBetsOpen {
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
        ownerPool += betFee;
        prizePool += betPrice;
        // todo - include the msg.sender to be in the game
        slots.push(msg.sender);
    }

    function closeLottery() external {
        require(closingTimeStamp > block.timestamp, "too soon to close");
        require(betsOpen, "Bets are closed");
        // todo - pick randomly a winner
        if (slots.length > 0) {
            uint256 winnerIndex = getrandomNumber() % slots.length;
            address winner = slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete(slots); 
        }
        betsOpen = false;
    }

    function getrandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.difficulty;
    }
    modifier onlyWhenBetsOpen {
        require(betsOpen, "Bets are closed");
        require(closingTimeStamp > block.timestamp, "the bet duration is over");

        _;
    }


    // prize withdraw

    // owner withdraw

    // return tokens
}