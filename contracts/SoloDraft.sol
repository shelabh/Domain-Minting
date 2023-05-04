// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// contract SoloDraft is ERC721 {
//     uint256 public maxSupply;
//     uint256 public totalSupply;
//     address public owner;

//     struct Domain {
//         string name;
//         uint256 cost;
//         bool isOwned;
//     }

//     mapping(uint256 => Domain) domains;

//     modifier onlyOwner() {
//         require(msg.sender == owner);
//         _;
//     }

//     constructor(string memory _name, string memory _symbol)
//         ERC721(_name, _symbol)
//     {
//         owner = msg.sender;
//     }

//     function list(string memory _name, uint256 _cost) public onlyOwner {
//         maxSupply++;
//         domains[maxSupply] = Domain(_name, _cost, false);
//     }

//     function mint(uint256 _id) public payable {
//         require(_id != 0);
//         require(_id <= maxSupply);
//         require(domains[_id].isOwned == false);
//         require(msg.value >= domains[_id].cost);

//         domains[_id].isOwned = true;
//         totalSupply++;

//         _safeMint(msg.sender, _id);
//     }

//     function getDomain(uint256 _id) public view returns (Domain memory) {
//         return domains[_id];
//     }

//     function getBalance() public view returns (uint256) {
//         return address(this).balance;
//     }

//     function withdraw() public onlyOwner {
//         (bool success, ) = owner.call{value: address(this).balance}("");
//         require(success);
//     }
// }


pragma solidity ^0.8.10;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
// We import another help function
import {Base64} from "./libraries/Base64.sol";

import "hardhat/console.sol";

contract Domains is ERC721URIStorage {
    // Here's our domain TLD!

    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string[3] public tld;

    // We'll be storing our NFT images on chain as SVGs
    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = "</text></svg>";

    mapping(string => address) public domains;
    mapping(string => string) public records;

    address payable public owner;



    constructor(string[3] memory _tld)
        payable
        ERC721("SoloDraft", "SD")
    {
        // for (int i = 0; i < 3; i++) {
            owner = payable(msg.sender);
            tld = _tld;
            for (uint i = 0; i < tld.length; i++) { 
                console.log("%s name service deployed", _tld[i]); 
            }
        
        // } 
    }

    function register(string[1] calldata name) public payable {
        for (uint i = 0; i < name.length; i++) {
            require(domains[name[i]] == address(0));

            uint256 _price = price(name);
            require(msg.value >= _price, "Not enough ETH paid");

            // Combine the name[i] passed into the function  with the TLD
            for (uint8 j = 0; j < tld.length; j++) {
                string memory _name = string(abi.encodePacked(name[i], ".", tld[j]));
                // Create the SVG (image) for the NFT with the name[i]
                string memory finalSvg = string(
                    abi.encodePacked(svgPartOne, _name, svgPartTwo)
                );
            
                uint256 newRecordId = _tokenIds.current();
                uint256 length = StringUtils.strlen(name[i]);
                string memory strLen = Strings.toString(length);

                
                console.log(
                    "Registering %s.%s on the contract with tokenID %d",
                    name[i],
                    tld[j],
                    newRecordId
                );
                

                // Create the JSON metadata of our NFT. We do this by combining strings and encoding as base64
                string memory json = Base64.encode(
                    abi.encodePacked(
                        '{"name[i]": "',
                        _name,
                        '", "description": "A domain on the SoloDraft", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '","length":"',
                        strLen,
                        '"}'
                    )
                );

                string memory finalTokenUri = string(
                    abi.encodePacked("data:application/json;base64,", json)
                );

                console.log(
                    "\n--------------------------------------------------------"
                );
                console.log("Final tokenURI", finalTokenUri);
                console.log(
                    "--------------------------------------------------------\n"
                );

                _safeMint(msg.sender, newRecordId);
                _setTokenURI(newRecordId, finalTokenUri);
                domains[name[i]] = msg.sender;

                _tokenIds.increment();
            }
        }
    }

    // This function will give us the price of a domain based on length
    function price(string[1] calldata name) public pure returns (uint256) {
        for (uint i = 0; i < name.length; i++) {
            uint256 len = StringUtils.strlen(name[i]);
            require(len > 0);
            if (len == 3) {
                return 5 * 10**17; // 5 ETH = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 ETH cause the faucets don't give a lot
            } else if (len == 4) {
                return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
            } else {
                return 1 * 10**17;
            }
        }
    }

    // Other functions unchanged

    function getAddress(string[1] calldata name) public view returns (address) {
        // Check that the owner is the transaction sender
        for(uint i = 0; i < name.length; i++) {
            return domains[name[i]];
        }
    }

    function setRecord(string[1] calldata name, string calldata record) public {
        // Check that the owner is the transaction sender
        for(uint i = 0; i < name.length; i++) {
            require(domains[name[i]] == msg.sender);
            records[name[i]] = record;
        }
    }

    function getRecord(string[1] calldata name)
        public
        view
        returns (string memory)
    {
        for(uint i = 0; i < name.length; i++) {
            return records[name[i]];
        }
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw ETH");
    }
}