// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
    uint256 public lotteryNumber;
    address private owner;
    address payable[] private playersList;
    mapping(uint256 => address) public HistoryList;

    constructor() {
        owner = msg.sender;
    }

    //--------------------------- To Take Entry ---------------------------
    function entry() public payable {
        require(msg.value >= 0.05 ether, "You must send at least 0.05 ether");
        playersList.push(payable(msg.sender));
    }

    //--------------------------- Random Value Genrator ---------------------------
    function random() private view returns (uint256) {
        bytes32 _random = keccak256(
            abi.encodePacked(
                block.number,
                block.timestamp,
                block.difficulty,
                block.gaslimit,
                block.coinbase,
                playersList.length
            )
        );
        return uint256(_random);
    }

    //--------------------------- Pick Winner ---------------------------
    function picWinners() public {
        require(msg.sender == owner, "only owner can select winner");
        require(playersList.length > 0, "There are no players");

        uint256 index = random() % playersList.length;
        playersList[index].transfer(address(this).balance);

        HistoryList[lotteryNumber] = playersList[index];
        lotteryNumber++;

        // reset
        playersList = new address payable[](0);
    }

    //--------------------------- Get Pot Ammount ---------------------------
    function getPotAmmount() public view returns (uint256) {
        return (address(this).balance);
    }

    //--------------------------- Total Players ---------------------------
    function TotalPlayers() public view returns (uint256) {
        return playersList.length;
    }

    //--------------------------- Get Previous Winner ---------------------------
    function getHistory(uint256 lotteryId) public view returns (address) {
        return HistoryList[lotteryId];
    }

    //--------------------------- Get Current Participates ---------------------------
    function players() public view returns (address payable[] memory) {
        return playersList;
    }
}
