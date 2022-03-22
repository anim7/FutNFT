import React, { Component } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { Home as HomeComponent } from "../components/Home";

interface Props {}

export class Home extends Component {
  render() {
    return <HomeComponent />;
  }
}

export default Home;
