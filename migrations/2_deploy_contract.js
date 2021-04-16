var RingBNB = artifacts.require("./contracts/RingBNB.sol");

module.exports = function(deployer) {
  deployer.deploy(RingBNB);
};