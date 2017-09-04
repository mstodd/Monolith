pragma solidity ^0.4.2;

//ERC-20 compliant token contract for MonolithTokens which can be used to by shares of Monolith INC

import "contracts/interfaces/ERC20Interface.sol";

contract MonolithToken is ERC20Interface {
    mapping(address => uint) public balances;
    uint256 supply;
    uint256 supplyRemaining;
    mapping(address => mapping(address => uint)) allowed;

    address administrator;
    uint amountPerDrip;
    uint totalPending;
    address[] addressesWaiting;

    function MonolithToken() {
        administrator = msg.sender;
        supply = 2001;
        supplyRemaining = 2001;
        amountPerDrip = 3;
    }

    modifier adminOnly() {
        require(msg.sender == administrator);
        _;
    }

    function totalSupply() constant returns (uint256 totalSupply) {
        return supply;
    }

    function balanceOf(address owner) constant returns (uint balance) {
        return balances[owner];
    }

    function transfer(address to, uint amount) returns (bool success) {
        if(amount > 0 && balances[msg.sender] >= amount) {
            balances[msg.sender] -= amount;
            balances[to] += amount;

            return true;
        } else {
            return false;
        }
    }

    function approve(address spender, uint amount) returns (bool success) {
        if(amount >= 0 && balances[msg.sender] >= amount) {
            allowed[msg.sender][spender] = amount;

            Approval(msg.sender, spender, amount);

            return true;
        }

        return false;
    }

    function allowance(address owner, address spender) constant returns (uint remaining) {
        return allowed[owner][spender];
    }

    function transferFrom(address from, address to, uint amount) returns (bool success){
        if (balances[from] >= amount
            && allowed[from][msg.sender] >= amount
            && amount > 0
            && balances[to] + amount > balances[to]) { //overflow check perhaps?
            balances[from] -= amount;
            allowed[from][msg.sender] -= amount;
            balances[to] += amount;

            Transfer(from, to, amount);

            return true;
        } else {
            return false;
        }
    }

    function drip(address to) private returns (bool success) {
        if(supplyRemaining < 500) {
             
        } else if(supplyRemaining < 1000 ) {

        } else {

        }

        return false;
    }

    function openFaucet() returns (bool success) {
        return false;
    }

    function registerFaucetRecipient() returns (bool success) {
        return false;
    }
}
