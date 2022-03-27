import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { MatchWithRouter } from "../../components/Match";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
}

const Play: NextPage<Props> = ({ account, futNFT, futNFTMatch, setLoader }) => {
  return (
    <MatchWithRouter
      account={account}
      futNFT={futNFT}
      futNFTMatch={futNFTMatch}
      setLoader={setLoader}
    />
  );
};

export default Play;
