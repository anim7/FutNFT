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
import Loader from "../components/Loader";
import PlayerInformation from "../components/PlayerInformation";
import { Player } from "../global/player";
import Deposit from "../components/Deposit";
import Withdraw from "../components/Withdraw";

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
  loader: boolean;
  playerInfo: Player;
  playerInfoActivated: boolean;
  depositTab: boolean;
  withdrawTab: boolean;
}
class App extends React.Component<Props, State> {
  address = "0x2e1284aDa02F092a6756999D6B2e2D0a942888D8";
  constructor(props: Props) {
    super(props);
    const emptyContract = new ethers.Contract(
      this.address,
      futNFTMatchABI,
      new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    );
    this.state = {
      account: "0x0",
      blockchainDataLoaded: false,
      futNFT: emptyContract,
      futNFTMatch: emptyContract,
      futNFTTraining: emptyContract,
      futNFTTransfer: emptyContract,
      vrfConsumer: emptyContract,
      loader: false,
      playerInfo: {
        name: "",
        age: 0,
        id: 0,
        imageURI: "",
        lastUpgrade: 0,
        level: 0,
        preferredPosition: "",
        suitablePositions: [],
      },
      playerInfoActivated: false,
      depositTab: false,
      withdrawTab: false,
    };
  }

  async withdraw(amount: number) {
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const signer = provider.getSigner();
    const tx = await this.state.futNFT
      .connect(signer)
      .withdraw(ethers.utils.formatUnits(amount.toString(), "ether"));
    await tx.wait();
  }

  async componentDidMount() {
    this.setLoader(true);
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadContracts();
    this.setState({ blockchainDataLoaded: true });
    // await this.withdraw(3);
    // await this.createPlayers();
    // await this.getRandomNumber();
    const l1 = await this.state.futNFTMatch.lineupSet(0);
    const l2 = await this.state.futNFTMatch.lineupSet(1);
    console.log(l1, l2);
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const signer = provider.getSigner();
    const opponent = await this.state.futNFTMatch
      .connect(signer)
      .callStatic.getOpponent();
    console.log(opponent);
  }

  //test
  async createPlayers() {
    const provider: ethers.providers.Web3Provider = (window as any).provider;
    const signer = provider.getSigner();
    if (this.state.account == "0x844ecf0b33eb65e1ec34aea0d082d39879169890") {
      const player1: Player = {
        name: "Lionel Messi",
        age: 34,
        id: 1,
        imageURI:
          "https://bafybeiam37td4lkemtodxihzkjvmb536nm326co76qlvnotu5xgfii2pz4.ipfs.dweb.link/messi.png",
        lastUpgrade: 1648381856 - 43200,
        level: 24,
        preferredPosition: "RWF",
        suitablePositions: ["ST", "CF", "AMF"],
      };
      await this.state.futNFT.connect(signer).mint(player1);
      const player2: Player = {
        name: "Lionel Messi",
        age: 34,
        id: 2,
        imageURI:
          "https://bafybeiam37td4lkemtodxihzkjvmb536nm326co76qlvnotu5xgfii2pz4.ipfs.dweb.link/messi.png",
        lastUpgrade: 1648381856 - 43200,
        level: 24,
        preferredPosition: "RWF",
        suitablePositions: ["ST", "CF", "AMF"],
      };
      await this.state.futNFT.connect(signer).mint(player2);
      const player3: Player = {
        name: "Cristiano Ronaldo",
        age: 37,
        id: 3,
        imageURI:
          "https://bafybeia6f4lqbkyynn7pg6nu3fcu7q33ejby3lrcyqzrmywixps2ga6gwi.ipfs.dweb.link/cristiano_ronaldo.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "LWF",
        suitablePositions: ["ST", "CF"],
      };
      await this.state.futNFT.connect(signer).mint(player3);
      const player4: Player = {
        name: "Cristiano Ronaldo",
        age: 37,
        id: 4,
        imageURI:
          "https://bafybeia6f4lqbkyynn7pg6nu3fcu7q33ejby3lrcyqzrmywixps2ga6gwi.ipfs.dweb.link/cristiano_ronaldo.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "LWF",
        suitablePositions: ["ST", "CF"],
      };
      await this.state.futNFT.connect(signer).mint(player4);
      const player5: Player = {
        name: "Virgil Van Dijk",
        age: 30,
        id: 5,
        imageURI:
          "https://bafybeia5eg6oc47p3jxp52chgab3e7oxrn2yz242w43asswqkdi7myetfi.ipfs.dweb.link/virgil_van_dijk.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "CB",
        suitablePositions: ["LB"],
      };
      await this.state.futNFT.connect(signer).mint(player5);
      const player6: Player = {
        name: "Virgil Van Dijk",
        age: 30,
        id: 6,
        imageURI:
          "https://bafybeia5eg6oc47p3jxp52chgab3e7oxrn2yz242w43asswqkdi7myetfi.ipfs.dweb.link/virgil_van_dijk.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "CB",
        suitablePositions: ["LB"],
      };
      await this.state.futNFT.connect(signer).mint(player6);
      const player7: Player = {
        name: "Kevin De Bruyne",
        age: 30,
        id: 7,
        imageURI:
          "https://bafybeiesbwfspk4z43ec7ykezduxpcmlyy65fgcmhv22r5cch3hsp2yyum.ipfs.dweb.link/kevin_de_bruyne.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "AMF",
        suitablePositions: ["RMF", "CMF", "RWF"],
      };
      await this.state.futNFT.connect(signer).mint(player7);
      const player8: Player = {
        name: "Kevin De Bruyne",
        age: 30,
        id: 8,
        imageURI:
          "https://bafybeiesbwfspk4z43ec7ykezduxpcmlyy65fgcmhv22r5cch3hsp2yyum.ipfs.dweb.link/kevin_de_bruyne.png",
        lastUpgrade: 1648381856 - 43200,
        level: 17,
        preferredPosition: "AMF",
        suitablePositions: ["RMF", "CMF", "RWF"],
      };
      await this.state.futNFT.connect(signer).mint(player8);
      const player9: Player = {
        name: "Frenkie De Jong",
        age: 23,
        id: 9,
        imageURI:
          "https://bafybeiez2sh6htqmrsuumf6t6g3szovqh4eokwd66infb4uli3hzrtx7j4.ipfs.dweb.link/frenkie_de_jong.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "CMF",
        suitablePositions: ["DMF"],
      };
      await this.state.futNFT.connect(signer).mint(player9);
      const player10: Player = {
        name: "Frenkie De Jong",
        age: 23,
        id: 10,
        imageURI:
          "https://bafybeiez2sh6htqmrsuumf6t6g3szovqh4eokwd66infb4uli3hzrtx7j4.ipfs.dweb.link/frenkie_de_jong.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "CMF",
        suitablePositions: ["DMF"],
      };
      await this.state.futNFT.connect(signer).mint(player10);
      const player11: Player = {
        name: "Marquinhos",
        age: 27,
        id: 11,
        imageURI:
          "https://bafybeigkfk5kyo5gkygy7pxbhc4uf2z64mjkok6vz7keelnccs5cvhnkdi.ipfs.dweb.link/marquinhos.png",
        lastUpgrade: 1648381856 - 43200,
        level: 15,
        preferredPosition: "CB",
        suitablePositions: ["DMF"],
      };
      await this.state.futNFT.connect(signer).mint(player11);
      const player12: Player = {
        name: "Marquinhos",
        age: 27,
        id: 12,
        imageURI:
          "https://bafybeigkfk5kyo5gkygy7pxbhc4uf2z64mjkok6vz7keelnccs5cvhnkdi.ipfs.dweb.link/marquinhos.png",
        lastUpgrade: 1648381856 - 43200,
        level: 15,
        preferredPosition: "CB",
        suitablePositions: ["DMF"],
      };
      await this.state.futNFT.connect(signer).mint(player12);
      const player13: Player = {
        name: "Luke Shaw",
        age: 26,
        id: 13,
        imageURI:
          "https://bafybeig7rtntdualhonkyi74t2hbijlhbv7jsg4lroyyk5tjnz7xjlbxeq.ipfs.dweb.link/luke_shaw.png",
        lastUpgrade: 1648381856 - 43200,
        level: 13,
        preferredPosition: "LB",
        suitablePositions: ["CB"],
      };
      await this.state.futNFT.connect(signer).mint(player13);
      const player14: Player = {
        name: "Luke Shaw",
        age: 26,
        id: 14,
        imageURI:
          "https://bafybeig7rtntdualhonkyi74t2hbijlhbv7jsg4lroyyk5tjnz7xjlbxeq.ipfs.dweb.link/luke_shaw.png",
        lastUpgrade: 1648381856 - 43200,
        level: 13,
        preferredPosition: "LB",
        suitablePositions: ["CB"],
      };
      await this.state.futNFT.connect(signer).mint(player14);
      const player15: Player = {
        name: "Neymar Jr.",
        age: 30,
        id: 15,
        imageURI:
          "https://bafybeihb5w7c5fascwskwmzevcy7jjifv2ijqikjhetvumzxdbdmzvemty.ipfs.dweb.link/neymar_jr.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "LWF",
        suitablePositions: ["ST", "CF", "AMF"],
      };
      await this.state.futNFT.connect(signer).mint(player15);
      const player16: Player = {
        name: "Neymar Jr.",
        age: 30,
        id: 16,
        imageURI:
          "https://bafybeihb5w7c5fascwskwmzevcy7jjifv2ijqikjhetvumzxdbdmzvemty.ipfs.dweb.link/neymar_jr.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "LWF",
        suitablePositions: ["ST", "CF", "AMF"],
      };
      await this.state.futNFT.connect(signer).mint(player16);
      const player17: Player = {
        name: "Manuel Neuer",
        age: 35,
        id: 17,
        imageURI:
          "https://bafybeigzz4psacoehrnhs5r3vatk42mabtugtztq5qlvsja3lujmgz7gxu.ipfs.dweb.link/manuel_neuer.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "GK",
        suitablePositions: [],
      };
      await this.state.futNFT.connect(signer).mint(player17);
      const player18: Player = {
        name: "Manuel Neuer",
        age: 35,
        id: 18,
        imageURI:
          "https://bafybeigzz4psacoehrnhs5r3vatk42mabtugtztq5qlvsja3lujmgz7gxu.ipfs.dweb.link/manuel_neuer.png",
        lastUpgrade: 1648381856 - 43200,
        level: 16,
        preferredPosition: "GK",
        suitablePositions: [],
      };
      await this.state.futNFT.connect(signer).mint(player18);
      const player19: Player = {
        name: "Robert Lewandowski",
        age: 33,
        id: 19,
        imageURI:
          "https://bafybeieskiv4aepgowsrpvbrsimgyhkb62e4xisu7n3jcxih7ca2g7va6y.ipfs.dweb.link/robert_lewandowski.png",
        lastUpgrade: 1648381856 - 43200,
        level: 22,
        preferredPosition: "ST",
        suitablePositions: ["LWF", "CF"],
      };
      await this.state.futNFT.connect(signer).mint(player19);
      const player20: Player = {
        name: "Robert Lewandowski",
        age: 33,
        id: 20,
        imageURI:
          "https://bafybeieskiv4aepgowsrpvbrsimgyhkb62e4xisu7n3jcxih7ca2g7va6y.ipfs.dweb.link/robert_lewandowski.png",
        lastUpgrade: 1648381856 - 43200,
        level: 22,
        preferredPosition: "ST",
        suitablePositions: ["LWF", "CF"],
      };
      await this.state.futNFT.connect(signer).mint(player20);
      const player21: Player = {
        name: "Trent Alexander-Arnold",
        age: 23,
        id: 21,
        imageURI:
          "https://bafybeiggdoyf42fckpkvss566ea3zh65iv6hpewbupcxeshwkfdojgmfq4.ipfs.dweb.link/alexander_arnold.png",
        lastUpgrade: 1648381856 - 43200,
        level: 15,
        preferredPosition: "RB",
        suitablePositions: ["RMF"],
      };
      await this.state.futNFT.connect(signer).mint(player21);
      const player22: Player = {
        name: "Trent Alexander-Arnold",
        age: 23,
        id: 22,
        imageURI:
          "https://bafybeiggdoyf42fckpkvss566ea3zh65iv6hpewbupcxeshwkfdojgmfq4.ipfs.dweb.link/alexander_arnold.png",
        lastUpgrade: 1648381856 - 43200,
        level: 15,
        preferredPosition: "RB",
        suitablePositions: ["RMF"],
      };
      await this.state.futNFT.connect(signer).mint(player22);
      // setTimeout(async () => {
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(2, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(4, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(6, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(8, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(10, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(12, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(14, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(16, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(18, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(20, ethers.BigNumber.from(0.001));
      //   await this.state.futNFTTransfer
      //     .connect(signer)
      //     .list(22, ethers.BigNumber.from(0.001));
      // }, 10000);
    }
    // else {
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(2, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(4, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(6, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(8, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(10, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(12, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(14, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(16, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(18, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(20, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    //   await this.state.futNFTTraining.connect(signer).transferPlayer(22, {
    //     value: 0.001,
    //     gasLimit: 2000000,
    //     gasPrice: 30000000000,
    //   });
    // }
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
    this.setLoader(false);
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
      gasPrice: 3000000000,
      gasLimit: 2000000,
    });
    await tx.wait();
    console.log(tx);

    setTimeout(async () => {
      const result: BigNumber = await vrfConsumer.randomResult();
      console.log(result.toBigInt());
      console.log("done");
    }, 10000);
  }

  setLoader = (loader: boolean) => {
    this.setState({ loader: loader });
  };

  setPlayerInfo = (player: Player) => this.setState({ playerInfo: player });
  setPlayerInfoActivated = (activated: boolean) =>
    this.setState({ playerInfoActivated: activated });

  setDepositTab = (depositTab: boolean) =>
    this.setState({ depositTab: depositTab });

  setWithdrawTab = (withdrawTab: boolean) => {
    this.setState({ withdrawTab: withdrawTab });
  };

  render() {
    return (
      <>
        <Head>
          <title>FutNFT</title>
        </Head>
        <Navbar
          account={this.state.account}
          blockchainDataLoaded={this.state.blockchainDataLoaded}
          futNFTMatch={this.state.futNFTMatch}
          setDepositTab={this.setDepositTab}
          setWithdrawTab={this.setWithdrawTab}
        />
        {this.state.loader && <Loader />}
        <Alert
          message="Some Error Occurred!"
          okEnabled={true}
          id="errorAlert"
        />
        <Alert
          message="Non-Ethereum browser detected. Consider using MetaMask!"
          okEnabled={true}
          id="ethereumAlert"
        />
        <Alert
          id="matchAlert"
          message="Cannot play! First buy enough players"
          okEnabled={true}
        />
        {this.state.depositTab && (
          <Deposit
            setDepositTab={this.setDepositTab}
            futNFTMatch={this.state.futNFTMatch}
            setLoader={this.setLoader}
            account={this.state.account}
            setWithdrawTab={this.setWithdrawTab}
          />
        )}
        {this.state.withdrawTab && (
          <Withdraw
            account={this.state.account}
            futNFTMatch={this.state.futNFTMatch}
            setLoader={this.setLoader}
            setWithdrawTab={this.setWithdrawTab}
          />
        )}
        {this.state.playerInfoActivated && (
          <PlayerInformation
            player={this.state.playerInfo}
            setPlayerInfoActivated={this.setPlayerInfoActivated}
          />
        )}
        <this.props.Component
          account={this.state.account}
          blockchainDataLoaded={this.state.blockchainDataLoaded}
          futNFT={this.state.futNFT}
          futNFTTransfer={this.state.futNFTTransfer}
          futNFTTraining={this.state.futNFTTraining}
          futNFTMatch={this.state.futNFTMatch}
          vrfConsumer={this.state.vrfConsumer}
          setLoader={this.setLoader}
          setPlayerInfo={this.setPlayerInfo}
          setPlayerInfoActivated={this.setPlayerInfoActivated}
          {...this.props.pageProps}
        />
      </>
    );
  }
}

export default App;
