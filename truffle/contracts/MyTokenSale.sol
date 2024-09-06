// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// import "./CrowdSale.sol";
import "./MintedCrowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is MintedCrowdsale {
    KycContract kyc;

    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) public MintedCrowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 weiAmount
    ) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.kycCompleted(beneficiary),
            "KYC Not completed, purchase not allowed"
        );
    }
}
