import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import React from "react";
import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import Alert from "../components/Alert";

interface Props {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
}

interface State {
  account: string;
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      account: "0x0",
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== (window as any).ethereum) {
        window.alert("Have you installed multiple wallets?");
      }
      (window as any).web3 = new Web3((window as any).ethereum);
    } else if ((window as any).web3) {
      (window as any).web3 = new Web3((window as any).web3.currentProvider);
    } else {
      document.getElementById("ethereumAlert")!.style.display = "inline-block";
    }
  }

  async loadBlockchainData() {
    const web3: Web3 = (window as any).web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });
  }

  render() {
    return (
      <>
        <Alert
          message="Non-Ethereum browser detected. Consider using MetaMask!"
          okEnabled={true}
          id="ethereumAlert"
        />
        <Head>
          <title>FutNFT</title>
        </Head>
        <Navbar account={this.state.account} />
        <this.props.Component {...this.props.pageProps} />
      </>
    );
  }
}

export default App;
