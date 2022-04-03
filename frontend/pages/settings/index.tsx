import { ethers } from "ethers";
import { NextPage } from "next";
import React from "react";
import { Settings as SettingsComponent } from "../../components/Settings";

interface Props {
  setLoader: (loader: boolean) => void;
  futNFTTraining: ethers.Contract;
  futNFTMatch: ethers.Contract;
}

const Settings: NextPage<Props> = ({
  setLoader,
  futNFTMatch,
  futNFTTraining,
}) => {
  return (
    <SettingsComponent
      setLoader={setLoader}
      futNFTMatch={futNFTMatch}
      futNFTTraining={futNFTTraining}
    />
  );
};

export default Settings;
