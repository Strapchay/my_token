// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./ERC20Mintable.sol";

contract MyToken is ERC20Mintable {
    constructor() ERC20Mintable("StartDucks Cappucino Token", "CAPPU") {}
}
