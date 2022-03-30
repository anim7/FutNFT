import React, { Component } from "react";
import buyStyles from "../styles/Buy.module.scss";
import { Player } from "./Player";
import { Player as PlayerInterface } from "../global/player";
import { ethers } from "ethers";
import Confirm from "./Confirm";
import Search from "./Search";

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
    this.props.setLoader(true);
    const listedPlayerIds: PlayerInterface[] =
      await this.props.futNFT.getListedPlayers();
    const listedPlayers: PlayerInterface[] = [];
    const owners: string[] = [];
    listedPlayerIds.forEach(async (playerId) => {
      const player = await this.props.futNFT.getPlayer(playerId);
      const owner = await this.props.futNFT.ownerOf(playerId);
      owners.push(owner);
      listedPlayers.push(player);
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
  };

  buy = async (player: PlayerInterface) => {
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
      const price: bigint = await this.props.futNFTTransfer.listedPlayersPrices(
        player.id
      );
      const tx = await this.props.futNFTTransfer
        .connect(signer)
        .transferPlayer(player.id, {
          value: price,
          gasLimit: 2000000,
          gasPrice: 30000000000,
        });
      await tx.wait();
    }
    const newPlayerArr = this.state.listedPlayers.filter((pl) => pl !== player);
    this.setState({ listedPlayers: newPlayerArr });
    this.props.setLoader(false);
  };

  render() {
    return (
      <>
        <Search
          id="buySearch"
          handleClick={async () => {
            await this.getListedPlayers();
            this.props.setLoader(true);
            setTimeout(() => {
              const search = (
                document.getElementById("buySearch")! as HTMLInputElement
              ).value;
              if (search != "") {
                const newPlayers = this.state.listedPlayers.filter((player) =>
                  player.name.toLowerCase().includes(search.toLowerCase())
                );
                this.setState({ listedPlayers: newPlayers });
              }
              this.props.setLoader(false);
            }, 1500);
          }}
        />
        {this.state.conform && (
          <Confirm
            handleYesClick={async () => {
              this.setState({ conform: false });
              await this.buy(this.state.currentPlayer);
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
