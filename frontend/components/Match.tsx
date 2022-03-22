import { ethers } from "ethers";
import { NextRouter, useRouter } from "next/router";
import React, { Component } from "react";
import { getPlayersByOwner as getPlayersByOwnerUtil } from "../utils/getPlayersByOwner";

interface Props {
  account: string;
  futNFT: ethers.Contract;
}
interface State {
  playersIds: number[];
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
  }

  async componentDidMount() {
    await this.getPlayersByOwner(this.props.account);
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
  }

  getPlayersByOwner = async (owner: string) => {
    const players = await getPlayersByOwnerUtil(this.props.futNFT, owner);
    this.setState({
      playersIds: players,
    });
  };

  enoughPlayersAvailable = () => {
    if (this.state.playersIds.length >= 11) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <>
        <div>Match</div>
      </>
    );
  }
}
