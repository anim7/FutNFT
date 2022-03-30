import React from "react";
import { Player } from "../global/player";
import playerInformationStyles from "../styles/PlayerInformation.module.scss";

interface Props {
  player: Player;
  setPlayerInfoActivated: (activated: boolean) => void;
}

const PlayerInformation: React.FunctionComponent<Props> = ({
  player,
  setPlayerInfoActivated,
}) => {
  return (
    <>
      <div className={playerInformationStyles.playerInformationContainer}>
        <button onClick={() => setPlayerInfoActivated(false)}>✗</button>
        <div className={playerInformationStyles.information}>
          <h2>Player Information</h2>
          <span>Name</span>
          <p>{player.name}</p>
          <span>Age</span>
          <p>{player.age}</p>
          <span>Preferred Position</span>
          <p>{player.preferredPosition}</p>
          <span>Suitable Positions</span>
          <div>
            {player.suitablePositions.map((position, key) => {
              return <p key={key}>{position}</p>;
            })}
          </div>
          <span>Level</span>
          <p>{player.level}</p>
          <span>Last Upgrade</span>
          <p>{new Date(player.lastUpgrade * 1000).toDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default PlayerInformation;
