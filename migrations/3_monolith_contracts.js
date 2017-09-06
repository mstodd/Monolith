var MonolithToken = artifacts.require("./MonolithToken.sol");
var MonolithExchange = artifacts.require("./MonolithTokenExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(MonolithToken)
  .then(() => {
    return deployer.deploy(MonolithExchange, MonolithToken.address);
  })
  .then(() => {
    console.info('foo' + MonolithExchange.address);
    return MonolithToken.deployed()
      .then((instance) => instance.setExchangeContractAddress(MonolithExchange.address));
  });
};
