// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./CrowdSale.sol";
// import "./ERC20Mintable.sol";
import "./MyToken.sol";

contract MintedCrowdsale is Crowdsale {
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    ) Crowdsale(rate, wallet, token) {}

    function _deliverTokens(
        address beneficiary,
        uint256 tokenAmount
    ) internal override {
        // Potentially dangerous assumption about the type of the token.
        require(
            MyToken(address(token())).mint(beneficiary, tokenAmount),
            "MintedCrowdsale: minting failed"
        );
    }
}
