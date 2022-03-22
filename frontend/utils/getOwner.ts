import { ethers } from "ethers";

export const getOwner = async (
  futNFTMatch: ethers.Contract
): Promise<string> => {
  return futNFTMatch.owner();
};
