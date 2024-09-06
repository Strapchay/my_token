import { actions, EthContext, EthProvider } from "./contexts/EthContext";
import { useCallback, useContext, useEffect } from "react";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <AppContent />
        </div>
      </div>
    </EthProvider>
  );
}

function AppContent() {
  const { state, dispatch } = useContext(EthContext);
  const {
    loaded,
    web3,
    kycAddress,
    kycInstance,
    tokenSaleInstance,
    tokenInstance,
    accounts,
    userTokens,
    totalTokenSupplied,
  } = state;

  function handleInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    dispatch({ type: actions.init, data: { [name]: value } });
  }

  const updateLocalTokenState = useCallback(async () => {
    let userTokens = await tokenInstance.methods.balanceOf(accounts[0]).call();
    let totalTokenSupplied = await tokenInstance.methods.totalSupply().call();
    dispatch({ type: actions.init, data: { userTokens, totalTokenSupplied } });
  }, [accounts, dispatch, tokenInstance]);

  async function handleKycWhiteListing(e) {
    const kycOwner = await kycInstance.methods.owner().call();
    if (kycOwner !== accounts[0]) {
      alert("Only the kyc owner can whitelist an address");
      return;
    }
    await kycInstance.methods
      .setKycCompleted(kycAddress)
      .send({ from: accounts[0] });
    dispatch({ type: actions.init, data: { kycAddress: "0x123" } });
    alert(`KYC for ${kycAddress} is completed`);
  }

  async function handleBuyTokens() {
    await tokenSaleInstance.methods
      .buyTokens(accounts[0])
      .send({ from: accounts[0], value: web3.utils.toWei("1", "wei") });
  }

  useEffect(() => {
    async function syncUserToken() {
      await updateLocalTokenState();
    }
    if (tokenInstance && accounts[0]) syncUserToken();
  }, [tokenInstance, updateLocalTokenState, accounts]);

  useEffect(() => {
    if (tokenInstance && accounts[0]) {
      const tokenTransferEvent = tokenInstance.events
        .Transfer({ to: accounts[0] })
        .on("data", updateLocalTokenState);

      return () => {
        tokenTransferEvent.removeAllListeners("data");
      };
    }
  }, [tokenInstance, accounts, updateLocalTokenState]);

  return (
    <>
      {!loaded && <div>Loading Web3, accounts, and contract...</div>}
      {loaded && (
        <>
          <h1>StarDucks Cappucino Token Sale</h1>
          <p>Get your Tokens today!</p>
          <h2>Kyc Whitelisting</h2>
          Address to allow:
          <input
            type="text"
            name="kycAddress"
            value={kycAddress}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleKycWhiteListing}>
            Add to Whitelist
          </button>
          <h2>Buy Tokens</h2>
          <p>
            If you want to buy tokens, send wei to this address:
            {tokenSaleInstance?.options?.address}
          </p>
          <p>You currently have: {userTokens} CAPPU Tokens</p>
          <p>Total tokens minted: {totalTokenSupplied}</p>
          <button type="button" onClick={handleBuyTokens}>
            Buy more tokens
          </button>
        </>
      )}
    </>
  );
}

export default App;
