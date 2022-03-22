import { ethers } from "ethers";
import { NextRouter, useRouter } from "next/router";
import React, { Component } from "react";
import mintStyles from "../styles/Mint.module.scss";
import { getOwner } from "../utils/getOwner";

interface Props {
  account: string;
  futNFTMatch: ethers.Contract;
}
interface State {}
interface PropsWithRouter extends Props {
  router: NextRouter;
}

export const MintWithRouter: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  return <Mint {...props} router={router} />;
};

class Mint extends Component<PropsWithRouter, State> {
  constructor(props: PropsWithRouter) {
    super(props);
  }

  async componentDidMount() {
    const owner = await getOwner(this.props.futNFTMatch);
    if (owner.toLowerCase() !== this.props.account.toLowerCase()) {
      this.props.router.push("/");
    }
  }

  render() {
    return <div>Mint</div>;
  }
}

export default MintWithRouter;
