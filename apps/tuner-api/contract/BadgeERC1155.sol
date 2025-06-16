// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Badge1155 is ERC1155, Ownable {
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    function mintBadge(address to, uint256 id, uint256 amount, bytes memory data) external {
        _mint(to, id, amount, data);
    }

    function mintBatchBadge(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function setBaseURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    function getOwner() external view returns (address) {
        return owner();
    }

    function transferBadgeOwnership(address newOwner) external onlyOwner {
        transferOwnership(newOwner);
    }
}