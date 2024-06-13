// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact julien@strat.cc
contract UBI5 is Ownable {
    event Added(address indexed newBeneficiary);

    address public immutable eur;

    enum Status {
        UNREGISTERED,
        PENDING,
        ACTIVE,
        ENDED
    }

    struct Beneficiary {
        address addr;
        Status status;
        uint end;
    }

    Beneficiary[] public beneficiaries;

    constructor(address _eur, address initialOwner) Ownable(initialOwner) {
        eur = _eur;
    }

    /// @notice Adds the wallet address of a beneficiary
    /// @dev "5" represents 5 years
    /// @param newBeneficiary is a legit beneficiary: 1 person randomly selected out of 8 billion
    function addBeneficiary(address newBeneficiary) public {
        beneficiaries.push(
            Beneficiary({addr: newBeneficiary, status: Status.ACTIVE, end: block.number + 5})
        );

        emit Added(newBeneficiary);
    }

    function distribute() public {
        for (uint i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i].end > block.number) {
                transfer(beneficiaries[i].addr);
            }
        }
    }

    /// @dev The amount to transfer will remain a static value
    function transfer(address beneficiary) private {
        IERC20(eur).transfer(beneficiary, 2000 * 10 ** 18);
    }
}
