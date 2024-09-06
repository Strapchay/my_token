const myToken = artifacts.require("MyToken.sol");
const myTokenSale = artifacts.require("MyTokenSale");
const myKycContract = artifacts.require("KycContract");
require("dotenv").config({ path: "../.env" });
module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(myToken);
  await deployer.deploy(myKycContract);
  await deployer.deploy(
    myTokenSale,
    1,
    addr[0],
    myToken.address,
    myKycContract.address,
  );
  let tokenInstance = await myToken.deployed();
  await tokenInstance.addMinter(myTokenSale.address);
  let kycInstance = await myKycContract.deployed();
  const l = await kycInstance.owner();
  console.log("the kyc owner val", l);
};
