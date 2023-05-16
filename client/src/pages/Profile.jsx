import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { ethers } from "ethers";
import { DisplayCampaigns } from "../components";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaings] = useState("");
  const { web3, contract } = useContext(Context);
  useEffect(() => {
    const allCampaigns = async () => {
      try {
        const accounts = await web3.eth.getAccounts();

        const campaigns = await contract.methods.getCampaigs().call();
        const filterCampaign = campaigns.filter((camp) => {
          return camp.owner === accounts[0];
        });
        setCampaings(filterCampaign);
      } catch (error) {
        console.log(error);
        alert("*Something went wrong. Plz try againg!");
      }
    };
    contract && allCampaigns();
  }, [contract]);

  console.log(campaigns);
  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Profile;
