import { ethers } from "ethers";
import React, { Component } from "react";
import withdrawStyles from "../styles/Withdraw.module.scss";

interface Props {
  futNFTMatch: ethers.Contract;
  account: string;
  setLoader: (loader: boolean) => void;
  setWithdrawTab: (withdrawTab: boolean) => void;
}
interface State {
  balance: number;
}

class Withdraw extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      balance: 0,
    };
  }

  async componentDidMount() {
    await this.getBalance();
  }

  getBalance = async () => {
    this.props.setLoader(true);
    const balance = await this.props.futNFTMatch.ownersToDeposits(
      this.props.account
    );
    setTimeout(() => {
      this.setState({
        balance: parseFloat(
          parseFloat((balance / Math.pow(10, 18)).toString()).toString()
        ),
      });
      this.props.setLoader(false);
    }, 1500);
  };

  render() {
    return (
      <div className={withdrawStyles.withdrawContainer}>
        <button
          className={withdrawStyles.close}
          onClick={() => {
            this.props.setWithdrawTab(false);
          }}
        >
          ✗
        </button>
        <div className={withdrawStyles.withdraw}>
          <h2>Withdraw MATIC</h2>
          <p>Balance: {this.state.balance} MATIC</p>
          <div>
            <input type="number" name="amount" id="amount" />
            <span>MATIC</span>
          </div>
          <button
            onClick={async () => {
              const price = parseFloat(
                (document.getElementById("amount")! as HTMLInputElement).value
              );
              if (price <= this.state.balance) {
                try {
                  this.props.setLoader(true);
                  const provider: ethers.providers.Web3Provider = (
                    window as any
                  ).provider;
                  const signer = provider.getSigner();
                  const tx = await this.props.futNFTMatch
                    .connect(signer)
                    .withdrawDeposit(
                      ethers.utils.parseUnits(price.toString(), "ether")
                    );
                  await tx.wait();
                  await this.getBalance();
                  this.props.setLoader(false);
                } catch (err) {
                  console.error(err);
                  document.getElementById("errorAlert")!.style.display =
                    "inline-block";
                  this.props.setLoader(false);
                }
              }
            }}
          >
            Withdraw
          </button>
        </div>
      </div>
    );
  }
}

export default Withdraw;
