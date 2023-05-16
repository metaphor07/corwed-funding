import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { ethers } from "ethers";
import { DisplayCampaigns } from "../components";
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaings] = useState("");
  const { contract } = useContext(Context);
  useEffect(() => {
    const allCampaigns = async () => {
      try {
        const campaigns = await contract.methods.getCampaigs().call();
        const parsedCampaigns = campaigns?.map((camp, i) => ({
          owner: camp.owner,
          title: camp.title,
          description: camp.description,
          target: ethers.utils.formatEther(camp.target.toString()),
          deadline: camp.deadline,
          amountCollected: ethers.utils.formatEther(
            camp.amountCollected.toString()
          ),
          image: camp.image,
          pId: i,
        }));
        setCampaings(parsedCampaigns);
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

export default Home;
