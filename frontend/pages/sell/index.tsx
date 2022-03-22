import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Sell as SellComponent } from "../../components/Sell";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTMatch: ethers.Contract;
}

const Sell: NextPage<Props> = ({ account, futNFT, futNFTMatch }) => {
  return (
    <SellComponent
      account={account}
      futNFTMatch={futNFTMatch}
      futNFT={futNFT}
    />
  );
};

export default Sell;
