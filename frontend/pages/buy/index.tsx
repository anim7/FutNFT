import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Buy as BuyComponent } from "../../components/Buy";
import { Player } from "../../global/player";

interface Props {
  futNFT: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  futNFTTraining: ethers.Contract;
  setLoader: (loader: boolean) => void;
  account: string;
  setPlayerInfo: (player: Player) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
}

const Buy: NextPage<Props> = ({
  futNFT,
  setLoader,
  futNFTTransfer,
  account,
  setPlayerInfo,
  setPlayerInfoActivated,
  futNFTTraining,
}) => {
  return (
    <BuyComponent
      futNFT={futNFT}
      setPlayerInfo={setPlayerInfo}
      setPlayerInfoActivated={setPlayerInfoActivated}
      setLoader={setLoader}
      futNFTTransfer={futNFTTransfer}
      account={account}
      futNFTTraining={futNFTTraining}
    />
  );
};

export default Buy;
