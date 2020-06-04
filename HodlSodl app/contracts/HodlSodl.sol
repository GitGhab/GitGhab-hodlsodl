import "./Ownable.sol";
pragma solidity 0.5.12;

contract HodlSodl is Ownable{

      constructor (uint) public payable{
                  balance = msg.value;
          }

      Bet     private lastBet;
      uint    private balance;

      modifier costs(uint cost){
              require(msg.value >= cost);
              _;
          }

      struct Player {
            uint id;
            string name;
            uint age;
            string email;
            uint pin;
            uint repeatPin;

          }

      struct  Bet {
                  string name;
                      //defined betting hodl (1) or sodl (2)
                  uint optionChosen;
                      //defined running draw()function.
                  bool win;
                      //defined in makeBet from draw()function
                  uint betAmount;
                      //defined in makeBet msg.sender
                  address player;
                      //defined by wins or losses
                  uint playerBalance;
              }

      mapping (address => Bet) private betsQueue;

      mapping (address => Player) private gamers;

      function createPlayer(string memory name, uint age, string memory email, uint pin,uint repeatPin) public payable costs(1 ether){
              require(age < 100, "Age needs to be below 100");
              require(pin == repeatPin, "repeatPin not equal");
              require(msg.value >= 1 ether);
              balance += msg.value;

                  //This creates a player
                  Player memory newPlayer;
                  newPlayer.name = name;
                  newPlayer.age = age;
                  newPlayer.email = email;

                  insertPlayer(newPlayer);
                  //players.push(msg.sender);

                  assert(
                      keccak256(
                          abi.encodePacked(
                              gamers[msg.sender].name,
                              gamers[msg.sender].age,
                              gamers[msg.sender].email
                          )
                      )
                      ==
                      keccak256(
                          abi.encodePacked(
                              newPlayer.name,
                              newPlayer.age,
                              newPlayer.email
                          )
                      )
                  );
                  emit playerCreated(newPlayer.name, newPlayer.email);
          }

      function insertPlayer(Player memory newPlayer) private {
              address creator = msg.sender;
              gamers[creator] = newPlayer;
          }

      function getPlayer() public view returns(string memory name, uint age, string memory email){
              address creator = msg.sender;
              return (gamers[creator].name, gamers[creator].age, gamers[creator].email);
          }

      function deletePlayer(address creator) public onlyOwner {
              string memory name = gamers[creator].name;
              string memory email = gamers[creator].email;

              delete gamers[creator];
              assert(gamers[creator].age == 0);
              emit playerDeleted(name, email, msg.sender);
         }

      function withdrawAll() public onlyOwner returns(uint) {
              uint toTransfer = balance;
              balance = 0;
              msg.sender.transfer(toTransfer);
              return toTransfer;
         }

      function myLastBet() public view returns(string memory name, bool win, uint optionChosen, uint betAmount){
              return (
                      betsQueue[msg.sender].name,
                      betsQueue[msg.sender].win,
                      betsQueue[msg.sender].optionChosen,
                      betsQueue[msg.sender].betAmount
                  );
          }

      function myBalance() public view returns(string memory name, uint playerBalance){
              return (
                      betsQueue[msg.sender].name,
                      betsQueue[msg.sender].playerBalance
                  );
          }

      function makeBet(uint optionBid) payable public {
              // check if contract has enough balance
              require(msg.value <= balance);
              // set minimum bettable amount
              require(msg.value >= 0.1 ether);
              //This creates a lastBet based on Bet struct
              lastBet.name = gamers[msg.sender].name;
              lastBet.optionChosen = optionBid;
              lastBet.betAmount = msg.value;
              lastBet.player = msg.sender;
              lastBet.playerBalance = betsQueue[msg.sender].playerBalance;

              draw(optionBid);

              betsQueue[msg.sender] = lastBet;

          }

      function draw(uint optionChosen) private returns(bool){
              // Generate random data
              uint randomResult = now % 2;
              //if win true pay double to player
              if(randomResult == optionChosen){
              lastBet.win = true;
              balance = balance - lastBet.betAmount;
              lastBet.playerBalance += lastBet.betAmount *2;
              }
              //if win false pay betAmount to contract
              else{
              lastBet.win = false;
              balance = balance + lastBet.betAmount;
              }
              emit placedBet(lastBet.name,lastBet.player,msg.value,lastBet.win);
              return lastBet.win;

          }

      function withdrawPlayer() public returns(uint) {
              uint toTransfer = betsQueue[msg.sender].playerBalance;
              betsQueue[msg.sender].playerBalance = 0;
              msg.sender.transfer(toTransfer);
              return toTransfer;
          }

// eventi
      event playerCreated(string name, string email);
      event playerDeleted(string name, string email, address deletedBy);
      event placedBet(string name,address player, uint betAmount, bool win);

  }
