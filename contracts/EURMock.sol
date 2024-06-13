// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EURMock is ERC20 {
    constructor(uint _supply) ERC20("EURMock", "EURm") {
        _mint(msg.sender, _supply);
    }
}
