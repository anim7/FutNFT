import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Settings as SettingsComponent } from "../../components/Settings";

interface Props {
  setLoader: (loader: boolean) => void;
  futNFT: ethers.Contract;
  futNFTTraining: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  futNFTMatch: ethers.Contract;
}

const Settings: NextPage<Props> = ({
  setLoader,
  futNFT,
  futNFTMatch,
  futNFTTraining,
  futNFTTransfer,
}) => {
  return (
    <SettingsComponent
      setLoader={setLoader}
      futNFT={futNFT}
      futNFTMatch={futNFTMatch}
      futNFTTraining={futNFTTraining}
      futNFTTransfer={futNFTTransfer}
    />
  );
};

export default Settings;
