const HodlSodl = artifacts.require("HodlSodl");

module.exports = function(deployer) {
  deployer.deploy(HodlSodl,10, { value: web3.utils.toWei("10", "ether") });
};



// const CoinFlip = artifacts.require("CoinFlip");
//
// module.exports = function(deployer) {
//  deployer.deploy(CoinFlip,10, { value: web3.utils.toWei("10", "ether") });
// };
