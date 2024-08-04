// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract basicToken is ERC20, Ownable {

constructor(uint256 _totalSupply) ERC20("TEST","TS") Ownable(msg.sender){
_mint(msg.sender, (_totalSupply * 10 ** 18));
}
}