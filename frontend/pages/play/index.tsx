import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { MatchWithRouter } from "../../components/Match";

interface Props {
  account: string;
  futNFT: ethers.Contract;
}

const Play: NextPage<Props> = ({ account, futNFT }) => {
  return <MatchWithRouter account={account} futNFT={futNFT} />;
};

export default Play;
