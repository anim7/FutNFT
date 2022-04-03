import { match } from "assert";
import { ethers } from "ethers";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import React, { Component } from "react";
import { Lineup } from "../global/lineup";
import { Player } from "../global/player";
import matchStyles from "../styles/Match.module.scss";
import { getPlayer } from "../utils/getPlayer";
import { getPlayersByOwner as getPlayersByOwnerUtil } from "../utils/getPlayersByOwner";
import Alert from "./Alert";

interface Props {
  account: string;
  futNFT: ethers.Contract;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
}
interface State {
  playerIds: number[];
  players: Player[];
  lineUpPlayers: Player[];
  formations: string[];
  positionsInFormation: string[];
  lineupPlayersToPositions: Map<Player, string>;
  lineupSet: boolean;
  formation: string;
  lineup: Lineup;
  teamRating: string;
}
interface PropsWithRouter extends Props {
  router: NextRouter;
}

export const MatchWithRouter: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  return <Match {...props} router={router} />;
};

class Match extends Component<PropsWithRouter, State> {
  constructor(props: PropsWithRouter) {
    super(props);
    this.state = {
      playerIds: [],
      players: [],
      lineUpPlayers: [],
      formations: [],
      positionsInFormation: [],
      lineupPlayersToPositions: new Map(),
      lineupSet: false,
      formation: "",
      lineup: { formation: "", playerIds: [], positions: [], isValid: false },
      teamRating: "",
    };
  }

  async componentDidMount() {
    this.props.setLoader(true);
    await this.getPlayersByOwner(this.props.account);
    await this.getAllFormations();
    await this.getPositionsFromFormation(
      (document.getElementById("formation")! as HTMLSelectElement).value
    );
    await this.getPlayers(this.state.playerIds);
    await this.getTeamRating();
    const playersAvailable = this.enoughPlayersAvailable();
    if (!playersAvailable) {
      this.props.router.push("/");
      setTimeout(
        () =>
          (document.getElementById("matchAlert")!.style.display =
            "inline-block"),
        0
      );
    }
    await this.getUserLineup();
    console.log("Players: ");
    console.log(this.state.players);
    this.props.setLoader(false);
  }

  componentDidUpdate() {
    if (this.state.lineUpPlayers.length == 11) {
      let positionsAvailable = [...this.state.positionsInFormation];
      let correct = true;
      this.state.lineUpPlayers.forEach((player) => {
        if (
          positionsAvailable.includes(
            this.state.lineupPlayersToPositions.get(player)!
          )
        ) {
          const index = positionsAvailable.indexOf(
            this.state.lineupPlayersToPositions.get(player)!
          );
          positionsAvailable.splice(index, 1);
        } else {
          document.getElementById("wrongLineup")!.style.display =
            "inline-block";
          correct = false;
          if (this.state.lineupSet) {
            this.setState({ lineupSet: false });
          }
        }
      });
      if (correct) {
        document.getElementById("wrongLineup")!.style.display = "none";
        if (!this.state.lineupSet) {
          this.setState({ lineupSet: true });
        }
        console.log("correct");
      }
    } else {
      if (this.state.lineupSet) {
        this.setState({ lineupSet: false });
      }
    }
  }

  getTeamRating = async () => {
    try {
      this.props.setLoader(true);
      const teamRating = await this.props.futNFTMatch.getTeamRating(
        this.props.account
      );
      console.log("Team rating:");
      console.log(teamRating);
      setTimeout(() => {
        this.setState({ teamRating: teamRating.toString() });
        this.props.setLoader(false);
      }, 1500);
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  getUserLineup = async () => {
    try {
      const lineup = await this.props.futNFTMatch.lineUps(this.props.account);
      this.setState({ lineup: lineup });
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  getPlayersByOwner = async (owner: string) => {
    try {
      const players = await getPlayersByOwnerUtil(this.props.futNFT, owner);
      this.setState({
        playerIds: players,
      });
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  getPlayers = async (playerIds: number[]) => {
    try {
      let players: Player[] = [];
      playerIds.forEach(async (playerId) => {
        const player = await getPlayer(this.props.futNFT, playerId);
        players.push(player);
      });
      setTimeout(() => {
        this.setState({ players: players });
        this.props.setLoader(false);
      }, 1000);
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  enoughPlayersAvailable = () => {
    try {
      if (this.state.playerIds.length >= 11) {
        let length = 0;
        this.state.playerIds.forEach((playerId) => {
          if (playerId.toString() !== "0") {
            length++;
          }
        });
        if (length >= 11) {
          return true;
        }
      }
      return false;
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
      return false;
    }
  };

  getAllFormations = async () => {
    try {
      const formations = await this.props.futNFTMatch.getAllFormations();
      this.setState({ formations: formations });
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  getPositionsFromFormation = async (formation: string) => {
    try {
      const positions = await this.props.futNFTMatch.getPositionsFromFormation(
        formation
      );
      this.setState({ positionsInFormation: positions });
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  setPlayerPosition = (player: Player, position: string) => {
    try {
      const newLineupPlayersToPositions = this.state.lineupPlayersToPositions;
      newLineupPlayersToPositions.set(player, position);
      this.setState({ lineupPlayersToPositions: newLineupPlayersToPositions });
    } catch (err) {
      document.getElementById("errorAlert")!.style.display = "inline-block";
      this.props.setLoader(false);
    }
  };

  render() {
    return (
      <>
        <Alert
          id="wrongLineup"
          message="The positions of players are not set correctly!"
          okEnabled={true}
        />
        <div className={matchStyles.matchContainer}>
          <h2>
            {!this.state.lineup.isValid
              ? "Select Players for your Lineup"
              : "You have already set your lineup. Do you want to reset it again?"}
          </h2>
          {this.state.teamRating.length > 0 && (
            <h3>{this.state.teamRating} LVL</h3>
          )}
          <select
            name="formation"
            id="formation"
            className={matchStyles.dropdown}
            onChange={async () => {
              const formation = (
                document.getElementById("formation")! as HTMLSelectElement
              ).value;
              await this.getPositionsFromFormation(formation);
              this.setState({ formation: formation });
            }}
          >
            <optgroup label="Select your Formation">
              {this.state.formations.map((formation, key) => {
                return (
                  <option value={formation} key={key}>
                    {formation}
                  </option>
                );
              })}
            </optgroup>
            ;
          </select>
          <div className={matchStyles.selectPlayers}>
            {this.state.players.map((player, key) => {
              if (player.name.length > 0) {
                return (
                  <div
                    className={matchStyles.playerItem}
                    id={`playerList${key}`}
                    key={key}
                  >
                    {this.state.lineUpPlayers.includes(player) && (
                      <select
                        name={`position${key}`}
                        id={`position${key}`}
                        className={`${matchStyles.dropdown} ${matchStyles.positionDropdown}`}
                        onChange={() => {
                          this.setPlayerPosition(
                            player,
                            (
                              document.getElementById(
                                `position${key}`
                              )! as HTMLSelectElement
                            ).value
                          );
                        }}
                      >
                        <optgroup label="Select the position">
                          {this.state.positionsInFormation.map(
                            (position, key1) => {
                              return (
                                <option
                                  value={position}
                                  key={key1}
                                  onSelect={() => {
                                    const newPositions =
                                      this.state.positionsInFormation.filter(
                                        (pos) => pos != position
                                      );
                                    this.setState({
                                      positionsInFormation: newPositions,
                                    });
                                  }}
                                >
                                  {position}
                                </option>
                              );
                            }
                          )}
                        </optgroup>
                      </select>
                    )}
                    <button
                      className={matchStyles.player}
                      onClick={() => {
                        if (
                          !this.state.lineUpPlayers.includes(player) &&
                          this.state.lineUpPlayers.length < 11
                        ) {
                          this.setState({
                            lineUpPlayers: [
                              ...this.state.lineUpPlayers,
                              player,
                            ],
                          });
                          setTimeout(() => {
                            this.setPlayerPosition(
                              player,
                              (
                                document.getElementById(
                                  `position${key}`
                                )! as HTMLSelectElement
                              ).value
                            );
                          }, 0);
                          document.getElementById(
                            `playerList${key}`
                          )!.style.borderColor = "rgb(5, 238, 63)";
                          document.getElementById(
                            `playerImage${key}`
                          )!.style.borderColor = "rgb(5, 238, 63)";
                        } else {
                          const newLineUpPlayers =
                            this.state.lineUpPlayers.filter(
                              (pl) => pl != player
                            );
                          const newLineupPlayersToPositions =
                            this.state.lineupPlayersToPositions;
                          newLineupPlayersToPositions.delete(player);
                          this.setState({
                            lineUpPlayers: newLineUpPlayers,
                            lineupPlayersToPositions:
                              newLineupPlayersToPositions,
                          });
                          document.getElementById(
                            `playerList${key}`
                          )!.style.borderColor = "white";
                          document.getElementById(
                            `playerImage${key}`
                          )!.style.borderColor = "white";
                        }
                      }}
                    >
                      <div
                        className={matchStyles.imageContainer}
                        id={`playerImage${key}`}
                      >
                        <Image
                          src={player.imageURI}
                          alt="Player Image"
                          width={150}
                          height={210}
                        />
                      </div>
                      <p>{player.name}</p>
                      <p>LVL {player.level}</p>
                    </button>
                  </div>
                );
              }
            })}
          </div>
          {/* {this.state.lineUpPlayers.length == 11 && (
          <>
            <h2>Select Positions for your Players</h2>
            <div className={matchStyles.selectPositions}>
              <div className={matchStyles.positionsImageContainer}>
                <Image
                  src={this.state.lineUpPlayers[0].imageURI}
                  alt="Player Image"
                  width={225}
                  height={315}
                />
              </div>
              <p>{this.state.lineUpPlayers[0].name}</p>
              <p>LVL {this.state.lineUpPlayers[0].level}</p>
            </div>
          </>
        )} */}
          {this.state.lineupSet && (
            <div>
              <button
                className={matchStyles.btn}
                onClick={async () => {
                  try {
                    this.props.setLoader(true);
                    const lineupPlayers = this.state.lineUpPlayers;
                    const playerIds: number[] = [];
                    const positions: string[] = [];
                    const formation = this.state.formation;
                    lineupPlayers.forEach((player) => {
                      playerIds.push(player.id);
                      const position: string =
                        this.state.lineupPlayersToPositions.get(player)!;
                      positions.push(position);
                    });
                    const provider: ethers.providers.Web3Provider = (
                      window as any
                    ).provider;
                    const signer = provider.getSigner();
                    const fee = await this.props.futNFTMatch.lineupFee();
                    const tx = await this.props.futNFTMatch
                      .connect(signer)
                      .setLineUp(playerIds, positions, formation, {
                        value: fee,
                        gasLimit: 1000000,
                        gasPrice: 30000000000,
                      });
                    await tx.wait();
                    await this.getUserLineup();
                    await this.getTeamRating();
                    this.props.setLoader(false);
                  } catch (err) {
                    document.getElementById("errorAlert")!.style.display =
                      "inline-block";
                    this.props.setLoader(false);
                  }
                }}
              >
                Set Lineup
              </button>
            </div>
          )}
          {this.state.lineup.isValid && (
            <>
              <div className={matchStyles.teamRating}></div>
              <div className={matchStyles.playNow}>
                <h2>Are you ready to face other teams?</h2>
                <button
                  onClick={async () => {
                    try {
                      const provider: ethers.providers.Web3Provider = (
                        window as any
                      ).provider;
                      const signer = provider.getSigner();
                      const matchFee = await this.props.futNFTMatch.matchFee();
                      const tx = await this.props.futNFTMatch
                        .connect(signer)
                        .play({
                          // value: matchFee,
                          gasLimit: 2000000,
                          gasPrice: 30000000000,
                        });
                      await tx.wait();
                    } catch (err) {
                      console.error(err);
                      document.getElementById("errorAlert")!.style.display =
                        "inline-block";
                      this.props.setLoader(false);
                    }
                  }}
                >
                  Play Now!
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
