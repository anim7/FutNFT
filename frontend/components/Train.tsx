import React, { Component } from "react";
import trainStyles from "../styles/Train.module.scss";
import { Player as PlayerInterface } from "../global/player";
import { Player } from "./Player";
import getPlayersByOwner from "../utils/getPlayersByOwner";
import { getPlayer } from "../utils/getPlayer";
import Alert from "./Alert";
import { ethers } from "ethers";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTTraining: ethers.Contract;
}
interface State {
  players: PlayerInterface[];
  cooldown: number;
}

export class Train extends Component<Props, State> {
  players: PlayerInterface[] = [
    {
      age: 34,
      imageURI:
        "https://bafybeicfhmevzs4aso7rqvx7l5ndb2ly7gudjyj5xjkztvohpwxw2za7iy.ipfs.dweb.link/nft.png",
      id: 1,
      level: 20,
      lastUpgrade: Math.floor(new Date().getTime() / 1000) - 43190,
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
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
      lastUpgrade: Math.floor(new Date().getTime() / 1000),
      name: "Cristiano Ronaldo",
      preferredPosition: "ST",
      suitablePositions: ["LWF", "CF"],
    },
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      players: [],
      cooldown: 43200,
    };
  }

  async componentDidMount() {
    this.setState({
      cooldown: await this.props.futNFTTraining.cooldown(),
    });
    await this.getPlayers();
  }

  getPlayers = async () => {
    const playerIds: number[] = await getPlayersByOwner(
      this.props.futNFT,
      this.props.account
    );
    let players: PlayerInterface[] = [];
    playerIds.forEach(async (id) => {
      const player = await getPlayer(this.props.futNFT, id);
      players.push(player);
    });
    this.setState({ players: players });
  };

  render() {
    return (
      <>
        <Alert
          id="cooldownAlert"
          message="Cooldown period is not over! Cannot level up!"
          okEnabled={true}
        />
        <div className={trainStyles.trainContainer}>
          {this.players.map((player, key) => {
            return (
              <Player
                btnId={`trainBtn${key}`}
                key={key}
                player={player}
                btnText={"Level Up"}
                handleClick={() => {
                  //change this
                  const timestamp = Math.floor(new Date().getTime() / 1000);
                  const lastUpgrade = player.lastUpgrade;
                  const cooldown = this.state.cooldown;
                  if (timestamp - lastUpgrade >= cooldown) {
                    player.level++;
                    player.lastUpgrade = timestamp;
                  } else {
                    document.getElementById("cooldownAlert")!.style.display =
                      "inline-block";
                  }
                }}
              />
            );
          })}
        </div>
      </>
    );
  }
}
