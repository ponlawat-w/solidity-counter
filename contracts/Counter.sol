// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Counter {
  uint256 private counter = 0;
  mapping(address => bool) collaborators;

  event Updated(uint256 currentValue);

  function addCollaborator(address addr) private {
    collaborators[addr] = true;
  }

  function get() public view returns(uint256) {
    return counter;
  }

  function increase() public {
    addCollaborator(msg.sender);
    emit Updated(++counter);
  }

  function hasCollaborated(address addr) public view returns(bool) {
    return collaborators[addr];
  }

  function hasCollaborated() public view returns(bool) {
    return hasCollaborated(msg.sender);
  }
}
