import Image from "next/image";
import React, { Component } from "react";
import { Player as PlayerInterface } from "../global/player";
import playerStyles from "../styles/Player.module.scss";
import PlayerInformation from "./PlayerInformation";

interface Props {
  player: PlayerInterface;
  btnText: string | null;
  handleClick: (() => void) | null;
  updateBtnText?: () => void;
  btnId: string;
  setPlayerInfo: (player: PlayerInterface) => void;
  setPlayerInfoActivated: (activated: boolean) => void;
}
interface State {}

export class Player extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.updateBtnText) {
      this.props.updateBtnText();
    }
  }
  render() {
    return (
      <>
        <div className={playerStyles.container}>
          <p className={playerStyles.position}>
            {this.props.player.preferredPosition}
          </p>
          <div className={playerStyles.item}>
            <div
              className={playerStyles.playerContainer}
              onClick={() => {
                this.props.setPlayerInfo(this.props.player);
                this.props.setPlayerInfoActivated(true);
              }}
            >
              <div className={playerStyles.imageContainer}>
                <Image
                  src={this.props.player.imageURI}
                  alt="Player Image"
                  width={300}
                  height={420}
                />
              </div>
              <p>{this.props.player.name}</p>
              <p>LVL {this.props.player.level}</p>
            </div>
            {this.props.btnText && this.props.handleClick && (
              <button
                className={playerStyles.buy}
                onClick={this.props.handleClick}
                id={this.props.btnId}
              >
                {this.props.btnText}
              </button>
            )}
          </div>
        </div>
      </>
    );
  }
}
