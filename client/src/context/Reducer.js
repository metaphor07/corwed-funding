const Reducer = (state, action) => {
  switch (action.type) {
    case "CONNECT_SUCCESS":
      return {
        web3: action.payload.web3,
        contract: action.payload.contract,
        error: false,
      };

    case "CONNECT_FAILURE":
      return {
        web3: null,
        contract: null,
        error: true,
      };
  }
};

export default Reducer;
