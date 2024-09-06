const actions = {
  init: "INIT",
};

const initialState = {
  web3: null,
  accounts: null,
  networkID: null,
  loaded: false,
  tokenInstance: null,
  kycInstance: null,
  tokenSaleInstance: null,
  tokenArtifact: null,
  kycArtifact: null,
  tokenSaleArtifact: null,
  storageValue: null,
  kycAddress: "0x123",
  userTokens: 0,
  totalTokenSupplied: 0,
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
