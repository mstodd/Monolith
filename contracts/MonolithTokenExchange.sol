pragma solidity ^0.4.2;

contract MonolithTokenExchange {
    address administrator;
    address monolithToken;

    function MonolithTokenExchange(address deployedTokenAddress) {
        administrator = msg.sender;
        monolithToken = deployedTokenAddress;
    }

    modifier adminOnly() {
        require(msg.sender == administrator);
        _;
    }

    function buyShares(uint256 tokenCount) returns (bool success) {
        return true;
    }
}
