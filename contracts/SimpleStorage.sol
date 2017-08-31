pragma solidity ^0.4.2;

contract SimpleStorage {
  mapping(address => uint) public storedData;

  function set(uint x) {
    storedData[msg.sender] = x;
  }

  function get() constant returns (uint) {
    return storedData[msg.sender];
  }
}
