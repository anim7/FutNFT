import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Train as TrainComponent } from "../../components/Train";
import { Player } from "../../global/player";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTTraining: ethers.Contract;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
  setPlayerInfo: (player: Player) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
}

const Train: NextPage<Props> = ({
  account,
  futNFT,
  futNFTTraining,
  futNFTMatch,
  setLoader,
  setPlayerInfo,
  setPlayerInfoActivated,
}) => {
  return (
    <TrainComponent
      account={account}
      futNFT={futNFT}
      futNFTTraining={futNFTTraining}
      futNFTMatch={futNFTMatch}
      setLoader={setLoader}
      setPlayerInfo={setPlayerInfo}
      setPlayerInfoActivated={setPlayerInfoActivated}
    />
  );
};

export default Train;
