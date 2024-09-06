// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "./Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    // constructor(address initialOwner) {}

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }
}
