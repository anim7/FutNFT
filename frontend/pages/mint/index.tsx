import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import MintWithRouter from "../../components/Mint";

interface Props {
  account: string;
  futNFTMatch: ethers.Contract;
}

const Mint: NextPage<Props> = ({ account, futNFTMatch }) => {
  return <MintWithRouter account={account} futNFTMatch={futNFTMatch} />;
};

export default Mint;
