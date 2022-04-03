import React, { Component } from "react";
import buyStyles from "../styles/Buy.module.scss";
import { Player } from "./Player";
import { Player as PlayerInterface } from "../global/player";
import { ethers } from "ethers";
import Confirm from "./Confirm";
import Filter from "./Filter";

interface Props {
  futNFT: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  setLoader: (loader: boolean) => void;
  account: string;
  setPlayerInfo: (player: PlayerInterface) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
  futNFTTraining: ethers.Contract;
}
interface State {
  listedPlayers: PlayerInterface[];
  conform: boolean;
  currentPlayer: PlayerInterface;
  owners: string[];
}

export class Buy extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listedPlayers: [],
      conform: false,
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
      owners: [],
    };
  }

  async componentDidMount() {
    this.props.setLoader(true);
    await this.getListedPlayers();
    console.log("Listed Players: ");
    console.log(this.state.listedPlayers);
  }

  getListedPlayers = async () => {
    try {
      this.props.setLoader(true);
      const listedPlayerIds: number[] =
        await this.props.futNFT.getListedPlayers();
      const listedPlayers: PlayerInterface[] = [];
      const owners: string[] = [];
      listedPlayerIds.forEach(async (playerId) => {
        if (playerId.toString() !== "0") {
          const player = await this.props.futNFT.getPlayer(playerId);
          const owner = await this.props.futNFT.ownerOf(playerId);
          owners.push(owner);
          listedPlayers.push(player);
        }
      });
      // const player: PlayerInterface = {
      //   id: 2,
      //   age: 37,
      //   imageURI:
      //     "https://bafybeia6f4lqbkyynn7pg6nu3fcu7q33ejby3lrcyqzrmywixps2ga6gwi.ipfs.dweb.link/cristiano_ronaldo.png",
      //   lastUpgrade: Math.floor(new Date().getTime() / 1000) - 43300,
      //   level: 17,
      //   name: "Cristiano Ronaldo",
      //   preferredPosition: "ST",
      //   suitablePositions: ["LFW", "CF"],
      // };
      // const provider: ethers.providers.Web3Provider = (window as any).provider;
      // const signer = provider.getSigner();
      // const tx = await this.props.futNFT.connect(signer).mint(player, {
      //   gasLimit: 1000000,
      //   gasPrice: 30000000000,
      // });
      // await tx.wait();
      setTimeout(() => {
        this.setState({
          listedPlayers: listedPlayers,
          owners: owners,
        });
        this.props.setLoader(false);
      }, 1000);
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  buy = async (player: PlayerInterface) => {
    try {
      this.props.setLoader(true);
      const owner = await this.props.futNFT.ownerOf(player.id);
      const provider: ethers.providers.Web3Provider = (window as any).provider;
      const signer = provider.getSigner();
      if (this.props.account.toLowerCase() === owner.toLowerCase()) {
        const tx = await this.props.futNFTTransfer
          .connect(signer)
          .unlist(player.id);
        await tx.wait();
      } else {
        const price: bigint =
          await this.props.futNFTTransfer.listedPlayersPrices(player.id);
        const tx = await this.props.futNFTTransfer
          .connect(signer)
          .transferPlayer(player.id, {
            value: price,
            gasLimit: 2000000,
            gasPrice: 30000000000,
          });
        await tx.wait();
      }
      const newPlayerArr = this.state.listedPlayers.filter(
        (pl) => pl !== player
      );
      this.setState({ listedPlayers: newPlayerArr });
      this.props.setLoader(false);
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
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
      await this.getListedPlayers();
      if (name.length > 0) {
        setTimeout(() => {
          const search = name;
          const newPlayers = this.state.listedPlayers.filter((player) =>
            player.name.toLowerCase().includes(search.toLowerCase())
          );
          this.setState({ listedPlayers: newPlayers });
          this.props.setLoader(false);
        }, 1500);
      }
      if (minLevel > 0 || maxLevel > 0) {
        setTimeout(() => {
          const newPlayers = this.state.listedPlayers.filter((player) => {
            if (minLevel > 0 && maxLevel > 0 && maxLevel >= minLevel) {
              return player.level >= minLevel && player.level <= maxLevel;
            } else if (minLevel > 0 && maxLevel === 0) {
              return player.level >= minLevel;
            } else if (minLevel === 0 && maxLevel > 0) {
              return player.level <= maxLevel;
            }
            return true;
          });
          this.setState({ listedPlayers: newPlayers });
          this.props.setLoader(false);
        }, 1500);
      }
      if (minPrice > 0 || maxPrice > 0) {
        setTimeout(() => {
          const newPlayers = this.state.listedPlayers.filter(async (player) => {
            const price: bigint =
              await this.props.futNFTTransfer.listedPlayersPrices(player.id);
            if (minPrice > 0 && maxPrice > 0 && maxPrice >= minPrice) {
              return price >= minPrice && price <= maxPrice;
            } else if (minPrice > 0 && maxPrice === 0) {
              return price >= minPrice;
            } else if (minPrice === 0 && maxPrice > 0) {
              return price <= maxPrice;
            }
            return true;
          });
          this.setState({ listedPlayers: newPlayers });
          console.log(this.state.listedPlayers);
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
          priceEnabled={true}
        />
        {this.state.conform && (
          <Confirm
            handleYesClick={async () => {
              try {
                this.setState({ conform: false });
                await this.buy(this.state.currentPlayer);
              } catch (err) {
                document.getElementById("errorAlert")!.style.display =
                  "inline-block";
                this.props.setLoader(false);
              }
            }}
            handleNoClick={() => this.setState({ conform: false })}
          />
        )}
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
                  btnText={
                    this.props.account.toLowerCase() ==
                    this.state.owners[key].toLowerCase()
                      ? `Unlist`
                      : "Buy"
                  }
                  handleClick={() => {
                    this.setState({
                      currentPlayer: player,
                      conform: true,
                    });
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
