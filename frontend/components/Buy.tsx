import React, { Component } from "react";
import buyStyles from "../styles/Buy.module.scss";
import { Player } from "./Player";
import { Player as PlayerInterface } from "../global/player";
import { ethers } from "ethers";

interface Props {
  futNFT: ethers.Contract;
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

  componentDidMount() {
    this.getListedPlayers();
    setTimeout(() => {
      console.log("LISTED PLAYERS:");
      console.log(this.state.listedPlayers);
    }, 5000);
  }

  getListedPlayers = async () => {
    const listedPlayers = await this.props.futNFT.getListedPlayers();
    this.setState({
      listedPlayers: listedPlayers,
    });
    // const player: PlayerInterface = {
    //   name: "Cristiano Ronaldo",
    //   preferredPosition: "ST",
    //   id: 1,
    //   age: 37,
    //   level: 17,
    //   lastUpgrade: new Date().getTime(),
    //   suitablePositions: ["CF", "LWF"],
    //   imageURI:
    //     "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
    // };
    // const provider = (window as any).provider;
    // const signer = provider.getSigner();
    // const tx = await futNFT.connect(signer).mint(player, {
    //   gasPrice: 30000000000,
    //   gasLimit: 2000000,
    // });
    // await tx.wait();
    // console.log("minted");
    const player1 = await this.props.futNFT.getPlayer(1);
    console.log(player1);
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
          return (
            <Player
              btnId={`buyBtn${key}`}
              key={key}
              player={player}
              btnText="Buy"
              handleClick={() => console.log(`Bought #${key + 1}`)}
            />
          );
        })}
      </div>
    );
  }
}
