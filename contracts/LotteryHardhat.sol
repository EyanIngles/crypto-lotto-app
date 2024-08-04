// SPDX-License-Identifier: MIT
// Copyright (c) 2024 Eyan Ingles
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

pragma solidity 0.8.20;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable {
    using SafeERC20 for IERC20;

    event LogMessage(string message);


    uint256 public timeStarter; //epoch 24 hours is 86400;
    uint256 public priceOfEntry;
    address[] public participants;
    address public winner;
    bool public winnerHasClaimed;
    uint256 public totalWinningsClaimed;
    uint256 public winAmount;
    uint256 public maxEntries; //
    uint256 public triggerAmount; // how many tokens is needed to be in the contract to trigger a winner.
    IERC20 token; //prizePool token memory slot

    mapping(address => uint256 entries) public rewardParticipants;

    event NewEntry(address indexed participant, uint256 entries);
    event Winner(address indexed participant, uint256);

    constructor(uint256 _PriceForEntry, IERC20 _token) Ownable(msg.sender) {
        token = _token; //writes a token address/contract to this variable.
        priceOfEntry = _PriceForEntry;
        maxEntries = 10 *_PriceForEntry;
        triggerAmount = 10000;
        winnerHasClaimed = false;
    }

    function donateToPrizeFund(uint256 _amount) public payable {
        require(_amount != 0, "please donate more than 0");
        token.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function enterReward(uint256 _entries) public payable returns (uint256) {
    require(_entries > 0 && _entries < maxEntries, "Entries must be between 1 and maxEntries");
    require(rewardParticipants[msg.sender] + _entries <= maxEntries, "Maximum entries exceeded for this draw");
    require(token.balanceOf(msg.sender) >= _entries * priceOfEntry, "Insufficient balance for entry");
    token.approve(address(this), _entries * priceOfEntry);
    token.safeTransferFrom(msg.sender, address(this), (priceOfEntry * _entries));
    for (uint256 i = 0; i < _entries; i++) {
        participants.push(msg.sender);
    }
    rewardParticipants[msg.sender] += _entries;
    if (token.balanceOf(address(this)) >= triggerAmount) {
        emit NewEntry(msg.sender, _entries);
        callWinner();
        return _entries;
    } else {
        emit NewEntry(msg.sender, _entries);
        return _entries;
    }
}

    function callWinner() public {
        require(triggerAmount >0,"Trigger amount to call winner has not been set");
        require(token.balanceOf(address(this)) >= triggerAmount,"Trigger amount has been been exceeded");
        if(winnerHasClaimed == false){
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp, // Current block timestamp
                    block.prevrandao, // Difficulty of the current block
                    msg.sender // Address of the caller
                )
            )
        );
        uint256 winnerNumber = randomNumber % participants.length;
        winner = participants[winnerNumber];
        winAmount = token.balanceOf(address(this));
        clearParticipants();
        } else {
            emit LogMessage("Winner has not claimed or winner has not been anounced.");
        }
    }
    function winnerCLaimPrize() public {
        require(winnerHasClaimed == false, "previous winner has not claimed.");
        require(msg.sender == winner,"You are not the winner");
        winnerHasClaimed = true;
        totalWinningsClaimed += winAmount;
        token.transfer(winner, winAmount);

    }

    function setTriggerAmount(uint256 _newTriggerAmount) external onlyOwner {
        require(triggerAmount != _newTriggerAmount && _newTriggerAmount >0,"This is already the trigger amount");
        triggerAmount = _newTriggerAmount;
    }
    function changeTriggerAmount(uint256 _newTriggerAmount) external onlyOwner {
        require(triggerAmount != _newTriggerAmount,"Already the trigger amount");
        triggerAmount = _newTriggerAmount;
    }
    function changeMaxEntries(uint256 _newMax) external onlyOwner {
        require(_newMax != maxEntries,"Already the max entry limit");
        maxEntries = _newMax;
    }
    // function needed to calculate winner and make it internal.
    // function to change to vote for a new entry price.

    function clearParticipants() internal {
        //this must be only owner function and internal. this function will be called once the winner has been picked.
        for (uint256 i = 0; i < participants.length; i++) {
            delete rewardParticipants[participants[i]];
        }
    }

    function checkEntries(address _participant) public view returns (uint256) {
        return rewardParticipants[_participant];
    }

    function checkIfInEntry(address _participant) public view returns (bool) {
        if (checkEntries(_participant) > 0) {
            return true;
        } else {
            return false;
        }
    }

    receive() external payable { } //no withdraw function
}
