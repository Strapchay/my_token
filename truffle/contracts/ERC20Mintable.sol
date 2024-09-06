// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MinterRole.sol";

contract ERC20Mintable is ERC20, MinterRole {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {}

    function mint(
        address account,
        uint256 amount
    ) public onlyMinter returns (bool) {
        _mint(account, amount);
        return true;
    }
}
