// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Survey1155 is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender){}

    function mint(
        address to,
        string memory surveyId,
        uint256 amount,
        string memory _uri
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(surveyId)));
        _mint(to, tokenId, amount, "");
        _setTokenURI(tokenId, _uri);
        return tokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory newuri) internal {
        _tokenURIs[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
