
pragma solidity 0.5.12;

contract Ownable{
    
    address public owner;                                       //shows the address of the owner in the public view

    
    modifier onlyOwner(){                                       //modifier to require that msg.sender is equal to owner
        require(msg.sender == owner);
        _;
    }

    constructor()public{                                        //runs when the contract is created, only once, not manually
        owner = msg.sender;                                     //set the owner as the msg.sender address
    }

}