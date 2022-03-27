import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import MintWithRouter from "../../components/Mint";

interface Props {
  account: string;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
}

const Mint: NextPage<Props> = ({ account, futNFTMatch, setLoader }) => {
  return (
    <MintWithRouter
      account={account}
      futNFTMatch={futNFTMatch}
      setLoader={setLoader}
    />
  );
};

export default Mint;
