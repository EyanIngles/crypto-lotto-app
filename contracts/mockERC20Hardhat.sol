// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.20;

import { CustomERC20 } from "./customERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token is CustomERC20, Ownable {
    uint256 public buyTax;
    uint256 public sellTax;
    address public developerWallet;
    address public prizePool;

    uint256 public swapThreshold;
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;

    event SwapThresholdUpdated();
    event BuyTaxesUpdated();
    event SellTaxesUpdated();
    event DevelopmentWalletUpdated();
    event PrizePoolWalletUpdated();
    event MaxTxAmountUpdated();
    event MaxWalletAmountUpdated();
    event StuckEthersCleared();
    event BurntTokens(address, uint256);
    event TokensBought(address, uint256);

    constructor(
        uint256 _totalSupply,
        uint256 _buyTax,
        uint256 _sellTax,
        address _developerWallet,
        address _prizePool
    )
        CustomERC20("Blockchain Lottery", "BLOT")
        Ownable(msg.sender)
    {
        require(_developerWallet != address(0), "Invalid tax recipient address");
        buyTax = _buyTax;
        sellTax = _sellTax;
        developerWallet = _developerWallet;
        prizePool = _prizePool;
        swapThreshold = (_totalSupply * 1) / 100; // Set swapThreshold to 1% of total supply, this value can be changed
        maxTxAmount = (_totalSupply * 2) / 100; // Set maxTxAmount to 2% of total supply, this value can be changed
        maxWalletAmount = (_totalSupply * 3) / 100; // Set max wallet to 3% of total supply, this value can be changed
        _mint(msg.sender, (_totalSupply * 10 ** 18)); // total supply intended but passed through as a wei value
    }

    function setBuyTax(uint256 _buyTax) external onlyOwner {
        // to change tax later on.
        require(_buyTax < 10, "BuyTax must be < 10%"); // must not be set to more than 10%
        buyTax = _buyTax;
        emit BuyTaxesUpdated();
    }

    function setSellTax(uint256 _sellTax) external onlyOwner {
        require(_sellTax < 10, "SellTax must be < 10%"); // must not be set to more than 10%
        sellTax = _sellTax;
        emit SellTaxesUpdated();
    }

    function setTaxRecipient(address _developerWallet) external onlyOwner {
        require(_developerWallet != address(0), "Invalid tax recipient address");
        developerWallet = _developerWallet;
        emit DevelopmentWalletUpdated();
    }

    function setPrizePoolAddress(address _prizePool) external onlyOwner {
        require(_prizePool != address(0), "Invalid prizePool address");
        prizePool = _prizePool;
        emit PrizePoolWalletUpdated();
    }

    function setSwapThreshold(uint256 _swapThreshold) external onlyOwner {
        require(_swapThreshold != swapThreshold, "Please insert new value");
        swapThreshold = _swapThreshold;
        emit SwapThresholdUpdated();
    }

    function setMaxTxAmount(uint256 _maxTxAmount) external onlyOwner {
        require(_maxTxAmount != maxTxAmount, "Please insert new value");
        maxTxAmount = _maxTxAmount;
        emit MaxTxAmountUpdated();
    }

    function setMaxWalletAmount(uint256 _maxWalletAmount) external onlyOwner {
        require(_maxWalletAmount != maxWalletAmount, "Please insert new value");
        maxWalletAmount = _maxWalletAmount;
        emit MaxWalletAmountUpdated();
    }

    function burn(address _account, uint256 _amount) external {
        require(_account == msg.sender, "Not your tokens to burn"); // the Tax % is also included into this function.
        _burn(_account, _amount);
        emit BurntTokens(_account, _amount);
    }

    function _transfer(address _from, address _to, uint256 _amount) internal virtual override {
        uint256 maxAmount = totalSupply() * maxWalletAmount / 100;
        require(balanceOf(_to) + _amount <= maxAmount, "Recipient exceeds max wallet amount");
        uint256 tax = 0;

        if (_from == owner()) {
            tax = (_amount * buyTax) / 100;
        } else if (_to == owner()) {
            tax = (_amount * sellTax) / 100;
        }

        if (tax > 0) {
            uint256 taxForDeveloper = tax / 5;
            uint256 taxForPrizePool = tax - taxForDeveloper;
            uint256 amountAfterTax = _amount - tax;

            super._transfer(_from, developerWallet, taxForDeveloper);
            super._transfer(_from, prizePool, taxForPrizePool);
            super._transfer(_from, _to, amountAfterTax);
            emit TokensBought(_to, amountAfterTax);
        } else {
            super._transfer(_from, _to, _amount);
            emit TokensBought(_to, _amount);
        }
    }
    // Withdraw function for any ERC20 token locked in the contract
    function withdrawLockedFunds(address _tokenAddress, address _to) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "No funds to withdraw");
        // the transfer call with the remaining balance to send to an address.
        token.transfer(_to, amount);
    }
    receive() external payable { }
}
