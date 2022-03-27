import React, { Component } from "react";
import buyStyles from "../styles/Buy.module.scss";
import { Player } from "./Player";
import { Player as PlayerInterface } from "../global/player";
import { ethers } from "ethers";

interface Props {
  futNFT: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  setLoader: (loader: boolean) => void;
  account: string;
  setPlayerInfo: (player: PlayerInterface) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
}
interface State {
  listedPlayers: PlayerInterface[];
}

export class Buy extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listedPlayers: [],
    };
  }

  async componentDidMount() {
    this.props.setLoader(true);
    await this.getListedPlayers();
    console.log("Listed Players: ");
    console.log(this.state.listedPlayers);
  }

  getListedPlayers = async () => {
    this.props.setLoader(true);
    const listedPlayerIds: PlayerInterface[] =
      await this.props.futNFT.getListedPlayers();
    const listedPlayers: PlayerInterface[] = [];
    listedPlayerIds.forEach(async (playerId) => {
      const player = await this.props.futNFT.getPlayer(playerId);
      console.log(player);
      listedPlayers.push(player);
    });
    // const player: PlayerInterface = {
    //   id: 1,
    //   age: 34,
    //   imageURI:
    //     "ipfs://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy/nft.png",
    //   lastUpgrade: Math.floor(new Date().getTime() / 1000) - 43200,
    //   level: 20,
    //   name: "Lionel Messi",
    //   preferredPosition: "RWF",
    //   suitablePositions: ["ST", "CF", "AMF", "RMF"],
    // };
    // const provider: ethers.providers.Web3Provider = (window as any).provider;
    // const signer = provider.getSigner();
    // const tx = await this.props.futNFT.connect(signer).mint(player, {
    //   gasLimit: 2000000,
    //   gasPrice: 30000000000,
    // });
    // await tx.wait();
    setTimeout(() => {
      this.setState({
        listedPlayers: listedPlayers,
      });
      this.props.setLoader(false);
    }, 1000);
  };

  players: PlayerInterface[] = [
    {
      age: 34,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 1,
      level: 20,
      lastUpgrade: new Date().getTime(),
      name: "Lionel Messi",
      preferredPosition: "RWF",
      suitablePositions: ["ST", "CF", "RMF", "CAM"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
    {
      age: 37,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 2,
      level: 17,
      lastUpgrade: new Date().getTime(),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
  ];

  render() {
    return (
      <div className={buyStyles.buyContainer}>
        {this.state.listedPlayers.map((player, key) => {
          if (player.name.length > 0) {
            return (
              <Player
                btnId={`buyBtn${key}`}
                setPlayerInfo={this.props.setPlayerInfo}
                setPlayerInfoActivated={this.props.setPlayerInfoActivated}
                key={key}
                player={player}
                btnText="Buy"
                handleClick={async () => {
                  this.props.setLoader(true);
                  const owner = await this.props.futNFT.ownerOf(player.id);
                  const provider: ethers.providers.Web3Provider = (
                    window as any
                  ).provider;
                  const signer = provider.getSigner();
                  if (this.props.account === owner) {
                    const tx = await this.props.futNFTTransfer
                      .connect(signer)
                      .unlist(player.id);
                    await tx.wait();
                  } else {
                    const price: bigint =
                      await this.props.futNFTTransfer.listedPlayersPrices(
                        player.id
                      );
                    const tx = await this.props.futNFTTransfer
                      .connect(signer)
                      .transferPlayer(player.id, {
                        value: price,
                        gasLimit: 2000000, gasPrice: 30000000000
                      });
                    await tx.wait();
                  }
                  const newPlayerArr = this.state.listedPlayers.filter(
                    (pl) => pl !== player
                  );
                  this.setState({ listedPlayers: newPlayerArr });
                  this.props.setLoader(false);
                }}
              />
            );
          }
        })}
      </div>
    );
  }
}
