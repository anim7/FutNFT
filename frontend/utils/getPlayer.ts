import { ethers } from "ethers";
import { Player } from "../global/player";

export const getPlayer = async (
  futNFT: ethers.Contract,
  id: number
): Promise<Player> => {
  const player: Player = await futNFT.getPlayer(id);
  return player;
};
