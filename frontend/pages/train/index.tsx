import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Train as TrainComponent } from "../../components/Train";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTTraining: ethers.Contract;
}

const Train: NextPage<Props> = ({ account, futNFT, futNFTTraining }) => {
  return (
    <TrainComponent
      account={account}
      futNFT={futNFT}
      futNFTTraining={futNFTTraining}
    />
  );
};

export default Train;
