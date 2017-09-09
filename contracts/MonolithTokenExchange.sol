pragma solidity ^0.4.2;

import "./MonolithToken.sol";

contract MonolithTokenExchange {
    struct registeredTrade {
        address buyer;
        uint256 tokenCount;
    }

    address public administrator;
    address public monolithToken;
    uint tokensPerShare = 3;
    mapping(address => uint256) public purchasedShares;
    registeredTrade[] public registeredTrades;

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
            registeredTrades.length++;
            registeredTrades[registeredTrades.length - 1].buyer = msg.sender;
            registeredTrades[registeredTrades.length - 1].tokenCount = tokenCount;
            
            return true;
        } else {
            return false;
        }
    }

    function executeBuys() returns (bool success) {
        if(msg.sender != administrator) {
            return false;
        }

        MonolithToken tokenContract = MonolithToken(monolithToken);
        while(registeredTrades.length > 0) {
            
            uint topTradeIndex = registeredTrades.length - 1;
            uint shareCount = registeredTrades[topTradeIndex].tokenCount / tokensPerShare;
            uint exchangeTokenCount = shareCount * tokensPerShare;

            tokenContract.balanceOf(registeredTrades[topTradeIndex].buyer);

            if(tokenContract.transferFrom(registeredTrades[topTradeIndex].buyer, administrator, registeredTrades[topTradeIndex].tokenCount)) {
                SharesExchanged(exchangeTokenCount, shareCount, registeredTrades[topTradeIndex].buyer);
                purchasedShares[registeredTrades[topTradeIndex].buyer] += shareCount;
            }

            registeredTrades.length--;
        }
        
        return true;
    }

    event SharesExchanged(uint256 tokenCount, uint256 sharesCount, address buyer);
}
