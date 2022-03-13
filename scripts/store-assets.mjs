import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const { NFT_STORAGE_API_KEY } = process.env;

async function storeAsset() {
  const client = new NFTStorage({
    token: NFT_STORAGE_API_KEY,
  });
  const metadata = await client.store({
    name: "Lionel Messi",
    description: "This is a NFT of Lionel Messi",
    age: 34,
    preferredPosition: "RWF",
    level: 20,
    lastUpgrade: new Date().getTime(),
    suitablePositions: ["ST", "CAM", "CF", "RMF"],
    image: new File([await fs.promises.readFile("assets/nft.png")], "nft.png", {
      type: "image/png",
    }),
  });
  console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url);
}

storeAsset()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
