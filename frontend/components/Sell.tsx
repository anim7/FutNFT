import React, { Component } from "react";
import sellStyles from "../styles/Sell.module.scss";
import { Player as PlayerInterface } from "../global/player";
import { Player } from "./Player";
import getPlayersByOwner from "../utils/getPlayersByOwner";
import { getPlayer } from "../utils/getPlayer";
import { ethers } from "ethers";
import Popup from "./Popup";
import PlayerInformation from "./PlayerInformation";
import Filter from "./Filter";

interface Props {
  account: string;
  futNFTMatch: ethers.Contract;
  futNFT: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  setLoader: (loader: boolean) => void;
  setPlayerInfo: (player: PlayerInterface) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
  futNFTTraining: ethers.Contract;
}
interface State {
  players: PlayerInterface[];
  popup: boolean;
  currentPlayer: PlayerInterface;
}

export class Sell extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      players: [],
      popup: false,
      currentPlayer: {
        name: "",
        age: 0,
        id: 0,
        imageURI: "",
        lastUpgrade: 0,
        level: 0,
        preferredPosition: "",
        suitablePositions: [],
      },
    };
  }

  async componentDidMount() {
    await this.getPlayers();
  }

  getPlayers = async () => {
    this.props.setLoader(true);
    const playerIds: number[] = await getPlayersByOwner(
      this.props.futNFT,
      this.props.account
    );
    let players: PlayerInterface[] = [];
    playerIds.forEach(async (id) => {
      const player = await getPlayer(this.props.futNFTMatch, id);
      players.push(player);
    });
    setTimeout(() => {
      this.setState({ players: players });
      this.props.setLoader(false);
    }, 1000);
  };

  applyFilters = async (
    name: string,
    minLevel: number,
    maxLevel: number,
    minPrice: number,
    maxPrice: number
  ) => {
    try {
      this.props.setLoader(true);
      await this.getPlayers();
      if (name.length > 0) {
        setTimeout(() => {
          const search = name;
          const newPlayers = this.state.players.filter((player) =>
            player.name.toLowerCase().includes(search.toLowerCase())
          );
          this.setState({ players: newPlayers });
          this.props.setLoader(false);
        }, 1500);
      }
      if (minLevel > 0 || maxLevel > 0) {
        setTimeout(() => {
          const newPlayers = this.state.players.filter((player) => {
            if (minLevel > 0 && maxLevel > 0 && maxLevel >= minLevel) {
              return player.level >= minLevel && player.level <= maxLevel;
            } else if (minLevel > 0 && maxLevel === 0) {
              return player.level >= minLevel;
            } else if (minLevel === 0 && maxLevel > 0) {
              return player.level <= maxLevel;
            }
            return true;
          });
          console.log(minLevel, maxLevel);
          this.setState({ players: newPlayers });
          this.props.setLoader(false);
        }, 1500);
      }
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  render() {
    return (
      <>
        <Filter
          handleClick={this.applyFilters}
          futNFTTraining={this.props.futNFTTraining}
          priceEnabled={false}
        />
        {this.state.popup && (
          <Popup
            handleCloseClick={() => this.setState({ popup: false })}
            handleClick={async () => {
              const price = ethers.utils.parseEther(
                parseFloat(
                  (document.getElementById("price")! as HTMLInputElement).value
                ).toString()
              );
              this.props.setLoader(true);
              const provider = (window as any).provider;
              const signer = provider.getSigner();
              const tx = await this.props.futNFTTransfer
                .connect(signer)
                .list(this.state.currentPlayer.id, price);
              await tx.wait();
              const newPlayers = this.state.players.filter(
                (pl) => pl !== this.state.currentPlayer
              );
              this.setState({ players: newPlayers });
              this.setState({ popup: false });
              this.props.setLoader(false);
            }}
          />
        )}
        <div className={sellStyles.sellContainer}>
          {this.state.players.map((player, key) => {
            if (player.name.length > 0) {
              return (
                <Player
                  btnId={`sellBtn${key}`}
                  setPlayerInfo={this.props.setPlayerInfo}
                  setPlayerInfoActivated={this.props.setPlayerInfoActivated}
                  key={key}
                  player={player}
                  btnText="Sell"
                  handleClick={async () => {
                    this.setState({ currentPlayer: player, popup: true });
                  }}
                />
              );
            }
          })}
        </div>
      </>
    );
  }
}
