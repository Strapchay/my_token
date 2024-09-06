require("dotenv").config({ path: "../.env" });
const truffleAssert = require("truffle-assertions");
const Token = artifacts.require("MyToken");

contract("Token Test", async (acc) => {
  const [deployerAcc, recipient, otherAcc] = acc;

  beforeEach(async () => {
    this.myToken = await Token.new();
  });

  it("all tokens should be in my account", async () => {
    let instance = this.myToken; //await Token.deployed();
    let totalSupply = await instance.totalSupply();
    let balance = await instance.balanceOf(deployerAcc);
    assert(balance.eq(totalSupply));
  });

  it("is possible to send tokens between accounts", async () => {
    let instance = this.myToken; // await Token.deployed();
    const sendTokens = 1;
    const initialTokens = 10;
    const sendTokensBN = web3.utils.toBN(sendTokens);
    let totalSupply = await instance.totalSupply();
    const initialbalance = await instance.balanceOf(deployerAcc);
    assert(initialbalance.eq(totalSupply));
    await truffleAssert.passes(instance.mint(deployerAcc, initialTokens));
    await truffleAssert.passes(instance.transfer(recipient, sendTokens));
    const balance = await instance.balanceOf(deployerAcc);
    const recipientBal = await instance.balanceOf(recipient);
    const newTotalSupply = await instance.totalSupply();
    assert(balance.eq(newTotalSupply.sub(sendTokensBN)));
    assert(recipientBal.eq(sendTokensBN));
  });
  it("is not possible to send tokens from an account that has no minterRole", async () => {
    let instance = this.myToken;
    await truffleAssert.reverts(
      instance.mint(recipient, web3.utils.toWei("1"), { from: recipient }),
    );
  });

  it("is possible to send tokens from an account that has minterRole", async () => {
    let instance = this.myToken;
    await truffleAssert.passes(instance.addMinter(recipient));
    await truffleAssert.passes(
      instance.mint(recipient, web3.utils.toWei("1"), { from: recipient }),
    );
  });

  it("is not possible to send more tokens than available in total", async () => {
    let instance = this.myToken; // await Token.deployed();
    const initialBalance = await instance.balanceOf(deployerAcc);

    let balanceOfDeployer = await initialBalance.add(web3.utils.toBN("1"));

    await truffleAssert.reverts(
      instance.transfer(recipient, balanceOfDeployer),
    );
    const balance = await instance.balanceOf(deployerAcc);

    assert(balance.eq(initialBalance));
  });
});
