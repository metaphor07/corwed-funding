// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    // at first here, we create a model of the campaign
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        // mapping(uint256 => mapping(address => uint256)) donationDetails;
    }

    // in blockchain the mapping is works like a database name is {campaigns}
    // where, index(uint) are pointing each documents(campaign)
    mapping(uint => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    // All Routs and their Functions are

    // 1. Create Campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        // at first we allot slot for the new document on database/map
        Campaign storage campaign = campaigns[numberOfCampaigns];

        // here write first the conditions
        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        // return the index no, where the data is saved in the map
        return numberOfCampaigns - 1;
    }

    // 2. Donate Campaign, here we pass the id of the campaign which want donate
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // send the amount to the campaign owner address
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    // 3. Get all donators list
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // 4. get all Campaigns list
    function getCampaigs() public view returns (Campaign[] memory) {
        // create a new Campaign data-type array instace of length (numberofcampaigns)
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
