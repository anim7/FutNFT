import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Buy as BuyComponent } from "../../components/Buy";

interface Props {
  futNFT: ethers.Contract;
}

const Buy: NextPage<Props> = ({ futNFT }) => {
  return <BuyComponent futNFT={futNFT} />;
};

export default Buy;
