import React, { useContext, createContext, useEffect, useReducer } from "react";
import Web3 from "web3";
import ABI from "./ABI.json";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const initialState = {
  contract: null,
  web3: null,
};

const StateContext = createContext(initialState);

// const reducer = (state, action)=>{
//   switch(action){
//     case "CONNECT": {
//       state.contract
//     }
//     default: {
//       return state;
//     }
//   }
// }
export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract(
  //   "0xd2B171DC6a686856D46CD35E3a46C4d4a2FC1539"
  // );
  // const { mutateAsync: createCampaign } = useContractWrite(
  //   contract,
  //   "createCampaign"
  // );

  // const [state, dispatch] = useReducer(reducer, initialState)

  const address = useAddress();
  // const connect = useMetamask();
  // let web3 = null;
  // let contract = null;
  const connect = async () => {
    console.log("in side in ");
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const contract = new web3.eth.Contract(
        ABI,
        "0x6D7038d65c6B7a19Eb7A2EF789AcCf287B76c831" //contract address which we get after deploy the contract on the test net
      );
      console.log(web3, contract);
      initialState.web3 = web3;
      initialState.contract = contract;
    } catch (error) {
      console.log(error);
      alert("*Error occured, Please Install Metamask!");
    }
  };
  useEffect(() => {
    console.log(initialState);
  }, [initialState]);

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image,
      ]);

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", pId, {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        initialState,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
