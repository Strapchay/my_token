require("dotenv").config({ path: "../.env" });
const truffleAssert = require("truffle-assertions");
const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

contract("TokenSale Test", async (acc) => {
  let chai, expect, BN;

  const [deployerAcc, recipient, otherAcc] = acc;

  it("should not have any tokens in my deployerAccount", async () => {
    let instance = await Token.deployed();
    let balance = await instance.balanceOf(deployerAcc);
    let emptyAcc = web3.utils.toBN("0");
    assert(balance.eq(emptyAcc));
  });

  it("all token should be in the TokenSale Smart contract by default", async () => {
    let instance = await Token.deployed();
    let balanceofTokenSaleSmartContract = await instance.balanceOf(
      TokenSale.address,
    );
    let totalSupply = await instance.totalSupply();
    assert(balanceofTokenSaleSmartContract.eq(totalSupply));
  });

  it("should be possible to buy tokens", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAcc);
    await kycInstance.setKycCompleted(deployerAcc, { from: deployerAcc });
    let sendTokenAmount = web3.utils.toWei("1", "wei");
    await truffleAssert.passes(
      tokenSaleInstance.sendTransaction({
        from: deployerAcc,
        value: sendTokenAmount,
      }),
    );
    let newBalance = await tokenInstance.balanceOf(deployerAcc);
    let newBalAmount = balanceBefore.add(web3.utils.toBN(sendTokenAmount));
    assert(newBalance.eq(newBalAmount));
  });

  it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let balanceBeforeAccount = await tokenInstance.balanceOf(recipient);
    let sendWeiAmount = web3.utils.toWei("1", "wei");
    await truffleAssert.reverts(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: sendWeiAmount,
      }),
    );
    let newBalance = await tokenInstance.balanceOf(recipient);
    assert(balanceBeforeAccount.eq(newBalance));

    let kycInstance = await KycContract.deployed();
    await truffleAssert.passes(kycInstance.setKycCompleted(recipient));
    await truffleAssert.passes(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: sendWeiAmount,
      }),
    );
    let newerBalance = await tokenInstance.balanceOf.call(recipient);

    let newBalanceAcc = balanceBeforeAccount.add(
      web3.utils.toBN(sendWeiAmount),
    );
    assert(newerBalance.eq(newBalanceAcc));
  });
});
