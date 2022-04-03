import { ethers } from "ethers";
import React, { useState } from "react";
import { Lineup } from "../global/lineup";
import depositStyles from "../styles/Deposit.module.scss";

interface Props {
  setDepositTab: (depositTab: boolean) => void;
  futNFTMatch: ethers.Contract;
  setLoader: (loader: boolean) => void;
  account: string;
  setWithdrawTab: (withdrawTab: boolean) => void;
}

const Deposit: React.FunctionComponent<Props> = ({
  setDepositTab,
  futNFTMatch,
  setLoader,
  account,
}) => {
  const [value, setValue] = useState<number>(1);
  return (
    <div className={depositStyles.depositContainer}>
      <button
        className={depositStyles.close}
        onClick={() => setDepositTab(false)}
      >
        ✗
      </button>
      <div className={depositStyles.deposit}>
        <h2>Deposit MATIC</h2>
        <div className={depositStyles.setValue}>
          <button
            onClick={() => {
              if (value > 1) {
                setValue(value - 1);
              }
            }}
          >
            -
          </button>
          <p>{value} MATIC</p>
          <button onClick={() => setValue(value + 1)}>+</button>
        </div>
        <button
          onClick={async () => {
            setLoader(true);
            setTimeout(async () => {
              try {
                const lineup: Lineup = await futNFTMatch.lineUps(account);
                const provider: ethers.providers.Web3Provider = (window as any)
                  .provider;
                if (lineup.isValid) {
                  const signer = provider.getSigner();
                  const tx = await futNFTMatch.connect(signer).deposit({
                    value: ethers.utils.parseEther(value.toString()),
                    gasLimit: 200000,
                    gasPrice: 30000000000,
                  });
                  await tx.wait();
                }
                setLoader(false);
              } catch (err) {
                console.error(err);
                document.getElementById("errorAlert")!.style.display =
                  "inline-block";
                setLoader(false);
              }
            }, 1000);
          }}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default Deposit;
