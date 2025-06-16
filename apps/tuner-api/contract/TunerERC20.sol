// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TUNER is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 30_000_000_000 * 1e18;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(msg.sender){
        _mint(msg.sender, 10_000_000_000 * 1e18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        uint256 amountWithDecimals = amount * 1e18;
        require(totalSupply() + amountWithDecimals <= MAX_SUPPLY, "TUNER: max supply exceeded");
        _mint(to, amountWithDecimals);
    }

    function burn(address account, uint256 amount) public {
        uint256 amountWithDecimals = amount * 1e18;
        _burn(account, amountWithDecimals);
    }

    function transferFromWithDecimals(address from, address to, uint256 amount) public {
        uint256 amountWithDecimals = amount * 1e18;
        _transfer(from, to, amountWithDecimals);
    }
}