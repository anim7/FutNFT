import Link from "next/link";
import React, { Component } from "react";
import homeStyles from "../styles/Home.module.scss";

interface Props {}
interface State {}

export class Home extends Component<Props, State> {
  render() {
    return (
      <div className={homeStyles.homeContainer}>
        <div className={homeStyles.description}>
          <h2>What is FutNFT?</h2>
          <p>
            FutNFT is an NFT game for football fans. You can buy, sell and train
            players you buy, which are NFTs. You can also earn money by winning
            matches played against other players. You need to have some
            knowledge about football in order to play this game.
          </p>
          <h3>Play Now!</h3>
          <Link href="/buy">
            <a>Buy Players</a>
          </Link>
        </div>
        <div className={homeStyles.earnMoney}>
          <h2>Different Ways to Earn Money</h2>
          <p>
            There are two ways to earn money through this game:
            <ul>
              <li>
                By playing matches against other players: You can win money by
                playing matches against other players. The higher you team
                rating the better chances you have to win.
              </li>
              <Link href="/play">
                <a id={homeStyles.play}>Play</a>
              </Link>
              <li>
                By selling players you have bought at higher prices: You can
                sell players at higher prices to earn money. You can also train
                players and improve their level to get more money.
              </li>
              <Link href="/sell">
                <a id={homeStyles.sell}>Sell</a>
              </Link>
            </ul>
          </p>
        </div>
        <div className={homeStyles.training}>
          <h2>Training</h2>
          <p>
            Training is important to level up your players which increases your
            team's rating. Teams with higher rating have more chances of winning
            in a match. Higher level players will also fetch you more money in
            the transfer market.
          </p>
          <h3>Train your players now!</h3>
          <Link href="/train">
            <a>Train</a>
          </Link>
        </div>
        <div className={homeStyles.match}>
          <h2>Play Against Others</h2>
          <p>
            Playing with others can earn you money. To play with others you must
            own at least 11 players.
          </p>
          <p>
            Navigate to the{" "}
            <Link href="/play">
              <a>Match</a>
            </Link>{" "}
            page and set your formation and lineup. You are ready to play
            against other players now. Click on the play now button.
          </p>
          <Link href="/play">
            <a id={homeStyles.play}>Play</a>
          </Link>
        </div>
        <div className={homeStyles.information}>
          <h2>Extra Information</h2>
          <ul>
            <li>
              The app is deployed on the polygon testnet (mumbai), so make sure
              your wallet is connected to this network
            </li>
            <li>
              Make sure you have enough MATIC in your account as all the
              transactions are done using this token
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
