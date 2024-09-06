import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (tokenArtifact, tokenSaleArtifact, kycArtifact) => {
      if (tokenArtifact && tokenSaleArtifact && kycArtifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi: tokenAbi } = tokenArtifact;
        const { abi: kycAbi } = kycArtifact;
        const { abi: tokenSaleAbi } = tokenSaleArtifact;
        let tokenInstance, tokenSaleInstance, kycInstance;

        try {
          const [tokenAddress, tokenSaleAddress, kycAddress] = [
            tokenArtifact.networks[networkID].address,
            tokenSaleArtifact.networks[networkID].address,
            kycArtifact.networks[networkID].address,
          ];
          [tokenInstance, tokenSaleInstance, kycInstance] = [
            new web3.eth.Contract(tokenAbi, tokenAddress),
            new web3.eth.Contract(tokenSaleAbi, tokenSaleAddress),
            new web3.eth.Contract(kycAbi, kycAddress),
          ];
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: {
            loaded: true,
            tokenArtifact,
            tokenSaleArtifact,
            kycArtifact,
            web3,
            accounts,
            networkID,
            tokenInstance,
            tokenSaleInstance,
            kycInstance,
          },
        });
      }
    },
    [],
  );

  useEffect(() => {
    const tryInit = async () => {
      try {
        const tokenArtifact = require("../../contracts/MyToken.json");
        const tokenSaleArtifact = require("../../contracts/MyTokenSale.json");
        const kycArtifact = require("../../contracts/KycContract.json");
        init(tokenArtifact, tokenSaleArtifact, kycArtifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.tokenArtifact, state.tokenSaleArtifact, state.kycArtifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
