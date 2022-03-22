import { ethers } from "ethers";
import { abi } from "../../artifacts/contracts/FutNFT.sol/FutNFT.json";

export const getPlayersByOwner = async (
  futNFT: ethers.Contract,
  owner: string
): Promise<number[]> => {
  return futNFT.getPlayersByOwner(owner);
};

export default getPlayersByOwner;
