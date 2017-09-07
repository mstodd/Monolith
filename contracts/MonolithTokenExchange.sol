pragma solidity ^0.4.2;

import "./MonolithToken.sol";

contract MonolithTokenExchange {
    address administrator;
    address monolithToken;
    uint tokensPerShare = 3;
    mapping(address => uint256) purchasedShares;
    mapping(address => uint256) pendingTrades;

    function MonolithTokenExchange(address deployedTokenAddress) {
        administrator = msg.sender;
        monolithToken = deployedTokenAddress;
    }

    modifier adminOnly() {
        require(msg.sender == administrator);
        _;
    }

    function getPurchasedSharesCount(address shareholder) constant returns (uint256 sharesCount) {
        return purchasedShares[shareholder];
    }

    function registerTrade(uint256 tokenCount) returns (bool success) {
        if(tokenCount > 0) {
            pendingTrades[msg.sender] = tokenCount;
            return true;
        } else {
            return false;
        }
    }

    function buyShares(uint256 tokenCount) returns (bool success) {
        uint256 shareCount = tokenCount / tokensPerShare;
        uint256 exchangeTokenCount = shareCount * tokensPerShare;

        MonolithToken tokenContract = MonolithToken(monolithToken);
        if(tokenContract.transferFrom(msg.sender, administrator, exchangeTokenCount)) {
            SharesExchanged(exchangeTokenCount, shareCount, msg.sender);
            purchasedShares[msg.sender] += shareCount;
            return true;
        } else {
            return false;
        }
    }

    event SharesExchanged(uint256 tokenCount, uint256 sharesCount, address buyer);
}
