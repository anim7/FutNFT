import "../styles/globals.scss";
import Navbar from "../components/Navbar";
import React from "react";
import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import detectEthereumProvider from "@metamask/detect-provider";
import Alert from "../components/Alert";
import { abi as futNFTABI } from "../../artifacts/contracts/FutNFT.sol/FutNFT.json";
import { abi as futNFTTrainingABI } from "../../artifacts/contracts/FutNFTTraining.sol/FutNFTTraining.json";
import { abi as futNFTTransferABI } from "../../artifacts/contracts/FutNFTTransfer.sol/FutNFTTransfer.json";
import { abi as futNFTMatchABI } from "../../artifacts/contracts/FutNFTMatch.sol/FutNFTMatch.json";
import { abi as vrfConsumerABI } from "../../artifacts/contracts/VRFConsumer.sol/VRFConsumer.json";
import { BigNumber, ethers } from "ethers";

interface Props {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
}

interface State {
  account: string;
  blockchainDataLoaded: boolean;
  futNFT: ethers.Contract;
  futNFTTransfer: ethers.Contract;
  futNFTTraining: ethers.Contract;
  futNFTMatch: ethers.Contract;
  vrfConsumer: ethers.Contract;
}
class App extends React.Component<Props, State> {
  address = "0x0088b2315E6DfEE90F75Af7292Abf9B13c6b7253";
  constructor(props: Props) {
    super(props);
    const emptyContract = new ethers.Contract(
      "",
      "",
      new ethers.providers.JsonRpcProvider("")
    );
    this.state = {
      account: "0x0",
      blockchainDataLoaded: false,
      futNFT: emptyContract,
      futNFTMatch: emptyContract,
      futNFTTraining: emptyContract,
      futNFTTransfer: emptyContract,
      vrfConsumer: emptyContract,
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.setState({ blockchainDataLoaded: true });
    // await this.getRandomNumber();
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== (window as any).ethereum) {
        window.alert("Have you installed multiple wallets?");
      }
      (window as any).provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
    } else if ((window as any).web3) {
      (window as any).web3 = new ethers.providers.Web3Provider(
        (window as any).web3.currentProvider
      );
    } else {
      document.getElementById("ethereumAlert")!.style.display = "inline-block";
    }
  }

  async loadBlockchainData() {
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const accounts = await provider.send("eth_requestAccounts", []);
    (window as any).signer = provider.getSigner();
    this.setState({
      account: accounts[0],
    });
    setInterval(async () => {
      const acc = await provider.send("eth_requestAccounts", []);
      if (acc[0] != this.state.account) {
        window.location.reload();
        window.location.pathname = "/";
        this.setState({ account: acc[0] });
      }
    }, 1000);
  }

  async loadContracts() {
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const futNFT = new ethers.Contract(this.address, futNFTABI, provider);

    const futNFTTraining = new ethers.Contract(
      this.address,
      futNFTTrainingABI,
      provider
    );

    const futNFTTransfer = new ethers.Contract(
      this.address,
      futNFTTransferABI,
      provider
    );

    const futNFTMatch = new ethers.Contract(
      this.address,
      futNFTMatchABI,
      provider
    );

    const vrfConsumer = new ethers.Contract(
      this.address,
      vrfConsumerABI,
      provider
    );
    this.setState({
      futNFT: futNFT,
      futNFTTransfer: futNFTTransfer,
      futNFTTraining: futNFTTraining,
      futNFTMatch: futNFTMatch,
      vrfConsumer: vrfConsumer,
    });
  }

  //test
  async getRandomNumber() {
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const signer: ethers.providers.JsonRpcSigner = provider.getSigner();
    const vrfConsumer = new ethers.Contract(
      this.address,
      vrfConsumerABI,
      provider
    );
    console.log("Start");
    const vrfConsumerWithSigner = vrfConsumer.connect(signer);
    const tx = await vrfConsumerWithSigner.getRandomNumber({
      gasPrice: 30000000000,
      gasLimit: 2000000,
    });
    await tx.wait();
    const result: BigNumber = await vrfConsumer.randomResult();
    console.log(result.toNumber());
    console.log("done");
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
        <Navbar
          account={this.state.account}
          blockchainDataLoaded={this.state.blockchainDataLoaded}
          futNFTMatch={this.state.futNFTMatch}
        />
        <this.props.Component
          account={this.state.account}
          blockchainDataLoaded={this.state.blockchainDataLoaded}
          futNFT={this.state.futNFT}
          futNFTTransfer={this.state.futNFTTransfer}
          futNFTTraining={this.state.futNFTTraining}
          futNFTMatch={this.state.futNFTMatch}
          vrfConsumer={this.state.vrfConsumer}
          {...this.props.pageProps}
        />
      </>
    );
  }
}

export default App;
