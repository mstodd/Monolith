pragma solidity ^0.4.2;

import "./MonolithToken.sol";

contract MonolithTokenExchange {
    address administrator;
    address monolithToken;
    uint tokensPerShare = 3;

    function MonolithTokenExchange(address deployedTokenAddress) {
        administrator = msg.sender;
        monolithToken = deployedTokenAddress;
    }

    modifier adminOnly() {
        require(msg.sender == administrator);
        _;
    }

    function buyShares(uint256 tokenCount) returns (bool success) {
        uint256 shareCount = tokenCount / tokensPerShare;
        uint256 exchangeTokenCount = shareCount * tokensPerShare;

        //MonolithToken tokenContract = MonolithToken(monolithToken);
        //tokenContract

        return true;
    }

    event SharesExchanged(uint256 tokenCount, uint256 shareCount);
}
