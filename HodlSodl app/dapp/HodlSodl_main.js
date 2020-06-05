var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
    	contractInstance = new web3.eth.Contract(abi,"0x1E5EcD2467985b5AF0bb838643B4194d430Ba6fA", {from: accounts[0]});
   		console.log(contractInstance);
    });
      //REGPAGE
      $("#register_button").click(inputData)
      $("#unregister_button").click(deletePlayer)
      //$("#goToGame_button").click(toGame)

      //GAMEPAGE
      $("#getPlayer_button").click(fetchAndDisplay)
      $("#myBalance_button").click(myBalance)
      $("#withdrawPlayer_button").click(withdraw)
      // $("#hodl_button").click(setOptionTo_1)
      // $("#sodl_button").click(setOptionTo_0)
      $("#makeBet_button").click(bet)
      $("#myLastBet_button").click(getResult)

      $("#hodl_button").click(function() {
        optionChosen = 1;
        console.log(optionChosen)
      });
      $("#sodl_button").click(function() {
        optionChosen = 0;
        console.log(optionChosen)
      });

});

///////////////////////§///////////////////////§///////////////////////§///////////////////////§///////////////////////§
function inputData(){
	var name =$("#name_input").val();
	var age =$("#age_input").val();
	var email =$("#email_input").val();
  var pin =$("#pin_input").val();
  var repeatPin =$("#repeatPin_input").val();

	var config = {value: web3.utils.toWei("1","ether")}


	contractInstance.methods.createPlayer(name, age, email, pin, repeatPin).send(config)
  	.on("transactionHash", function(hash){
  		console.log(hash);
  	})
  	.on("confirmation",function(confirmationNr){
  		console.log(confirmationNr);
  	})
  	.on("receipt", function(receipt){
  		console.log(receipt);
  		alert("Player created")
  	})
    .on("error", function(error){
         alert("oops, something went wrong!");
    })
}



function deletePlayer(){
	var addressToUnregister =$("#addressToUnregister_input").val();

  contractInstance.methods.deletePlayer(addressToUnregister).send()
  .on("transactionHash", function(hash){
    console.log(hash);
  })
  .on("confirmation",function(confirmationNr){
    console.log(confirmationNr);
  })
  .on("error", function(error){
       alert("oops, something went wrong!");
  })
}
///////////////////////§///////////////////////§///////////////////////§///////////////////////§///////////////////////§

function fetchAndDisplay(){
	contractInstance.methods.getPlayer().call().then(function(res){
		$("#name_output").text(res.name);
		$("#age_output").text(res.age);
		$("#email_output").text(res.email);
	})
}

function myBalance(){
	contractInstance.methods.myBalance().call().then(function(res){
		$("#nameBal_output").text(res.name);
		$("#myBalance_output").text(web3.utils.fromWei(res.playerBalance, 'ether')+ " Eth")
	})
}

function withdraw(){
    contractInstance.methods.withdrawPlayer().send()
    .on("transactionHash", function(hash){
      console.log(hash);

    })
    .on("confirmation",function(confirmationNr){
      console.log(confirmationNr);
    })
    .on("receipt", function(receipt){
  		console.log(receipt);
  		alert("withdrawn!")
  	})
    .on("error", function(error){
         alert("oops, something went wrong!");
    })
  }


//
// function bet() {
//     let betAmount = $('#bet_amount_input').val().toString();
//     betAmount = web3.utils.toWei(betAmount, "ether");
//
//     console.log(betAmount);
//     console.log(optionChosen);
//     contractInstance.methods.makeBet(optionChosen).send({value: betAmount})
//   }

  function bet() {
      let betAmount = $('#bet_amount_input').val().toString();
      betAmount = web3.utils.toWei(betAmount, "ether");


      contractInstance.methods.makeBet(optionChosen).send({value: betAmount})
        .on("receipt", function(receipt){

            if(receipt.events.placedBet.returnValues[3] == false){
              alert("You lose, play again!")
            }
            else if(receipt.events.placedBet.returnValues[3] == true){
              alert("You won, congratulations!")
            }
        })
        .on("error", function(error){
             alert("oops, something went wrong!");
        })
    }

  function getResult(){
    	contractInstance.methods.myLastBet().call().then(function(res){
    		$("#nameBet_output").text(res.name);
    		$("#win_output").text(res.win);

        $("#betAmount_output").text(web3.utils.fromWei(res.betAmount, 'ether')+ " Eth")
        $("#optionChosen_output").text(humanize(res.optionChosen));
    	})
    }

function humanize(optionChosen){
  if (optionChosen == 1){
    return "Hodl"
  } else if(optionChosen == 0) {
    return "Sodl"
  }
}
