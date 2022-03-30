import { ethers } from "ethers";
import { NextRouter, useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import React, { Component } from "react";
import { Player } from "../global/player";
import mintStyles from "../styles/Mint.module.scss";
import { getOwner } from "../utils/getOwner";

interface Props {
  account: string;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
}
interface State {
  positions: string[];
  positionsAdded: string[];
}
interface PropsWithRouter extends Props {
  router: NextRouter;
}

export const MintWithRouter: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  return <Mint {...props} router={router} />;
};

class Mint extends Component<PropsWithRouter, State> {
  constructor(props: PropsWithRouter) {
    super(props);
    this.state = {
      positions: [],
      positionsAdded: [],
    };
  }

  async componentDidMount() {
    const owner = await getOwner(this.props.futNFTMatch);
    if (owner.toLowerCase() !== this.props.account.toLowerCase()) {
      this.props.router.push("/");
    }
    this.setState({
      positions: await this.props.futNFTMatch.getAllPositions(),
      positionsAdded: [],
    });
  }

  async storeFile(name: string, file: File): Promise<string> {
    const client = new NFTStorage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNDU3NzRGZkNkYzQwNmFBYTU2RThEM2ZGRGJmRTQ3ZjQ3Q0M5MmYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzA5MTkzNzMwNywibmFtZSI6ImZ1dG5mdCJ9.a9ZnCTP5bq920TrpSdlNf26kN8lnHRubEScGFJMtmgE",
    });
    const metadata = await client.store({
      name: name,
      description: "FutNFT image",
      image: file,
    });
    console.log(metadata.data.image);

    let imageURI = metadata.data.image.href;
    imageURI = imageURI.replace("ipfs://", "");
    imageURI = imageURI.replace("/", ".ipfs.dweb.link/");
    imageURI = "https://" + imageURI;
    return imageURI;
  }

  render() {
    return (
      <div className={mintStyles.mintContainer}>
        <div className={mintStyles.mintForm}>
          <span className={mintStyles.label}>ID</span>
          <input type="number" name="id" id="id" className={mintStyles.input} />
          <span className={mintStyles.label}>Name</span>
          <input
            type="text"
            name="name"
            id="name"
            className={mintStyles.input}
          />
          <span className={mintStyles.label}>Age</span>
          <input
            type="number"
            name="age"
            id="age"
            className={mintStyles.input}
          />
          <span className={mintStyles.label}>Preferred Position</span>
          <input
            type="text"
            name="preferredPosition"
            id="preferredPosition"
            className={mintStyles.input}
          />
          <span className={mintStyles.label}>Suitable Positions</span>
          <input
            type="text"
            name="position"
            id={mintStyles.positionInput}
            className={mintStyles.input}
          />
          <div className={mintStyles.positions}>
            {this.state.positionsAdded.map((position, key) => {
              return (
                <div key={key} className={mintStyles.position}>
                  <p>{position}</p>
                  <button
                    onClick={() => {
                      const newPositions = this.state.positionsAdded.filter(
                        (pos) => pos != position
                      );
                      this.setState({ positionsAdded: newPositions });
                    }}
                  >
                    ✗
                  </button>
                </div>
              );
            })}
          </div>
          <input
            type="button"
            value="Add Suitable Position"
            className={mintStyles.submit}
            id={mintStyles.addPosition}
            onClick={() => {
              const text = (
                document.getElementById(
                  mintStyles.positionInput
                )! as HTMLInputElement
              ).value;
              if (
                this.state.positions.includes(text.toUpperCase()) &&
                !this.state.positionsAdded.includes(text.toUpperCase()) &&
                (
                  document.getElementById(
                    "preferredPosition"
                  )! as HTMLInputElement
                ).value !== text
              ) {
                this.setState({
                  positionsAdded: [...this.state.positionsAdded, text],
                });
              }
            }}
          />
          <span className={mintStyles.label}>Base Level</span>
          <input
            type="number"
            name="level"
            id="level"
            className={mintStyles.input}
          />
          <span className={mintStyles.label}>NFT Image</span>
          <input
            type="file"
            name="nftImage"
            className={mintStyles.input}
            id={mintStyles.imageUpload}
            accept=".png,.jpg,.jpeg"
          />
          <input
            type="button"
            value="Mint"
            className={mintStyles.submit}
            onClick={async () => {
              this.props.setLoader(true);
              console.log("start");
              const file = (
                document.getElementById(
                  mintStyles.imageUpload
                )! as HTMLInputElement
              ).files![0];
              console.log(file);
              const name = (
                document.getElementById("name")! as HTMLInputElement
              ).value;

              const imageURI = await this.storeFile(name, file);
              console.log(imageURI);

              let player: Player = {
                id: parseInt(
                  (document.getElementById("id")! as HTMLInputElement).value
                ),
                name: name,
                age: parseInt(
                  (document.getElementById("age")! as HTMLInputElement).value
                ),
                lastUpgrade: Math.floor(new Date().getTime() / 1000),
                level: parseInt(
                  (document.getElementById("level")! as HTMLInputElement).value
                ),
                suitablePositions: this.state.positionsAdded,
                preferredPosition: (
                  document.getElementById(
                    "preferredPosition"
                  )! as HTMLInputElement
                ).value,
                imageURI: imageURI,
              };
              const provider: ethers.providers.Web3Provider = (window as any)
                .provider;
              const signer = provider.getSigner();
              const tx = await this.props.futNFTMatch
                .connect(signer)
                .mint(player, { gasLimit: 1000000, gasPrice: 30000000000 });
              await tx.wait();
              this.props.setLoader(false);
            }}
          />
        </div>
      </div>
    );
  }
}

export default MintWithRouter;
