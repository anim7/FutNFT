import { ethers } from "ethers";
import Link from "next/link";
import React, { useState } from "react";
import settingsStyles from "../styles/Settings.module.scss";

interface Props {
  setLoader: (loader: boolean) => void;
  futNFTTraining: ethers.Contract;
  futNFTMatch: ethers.Contract;
}

export const Settings: React.FunctionComponent<Props> = ({
  futNFTMatch,
  futNFTTraining,
  setLoader,
}) => {
  const setValue = async (setter: ethers.ContractFunction, value: any) => {
    setLoader(true);
    const tx = await setter(value);
    await tx.wait();
    setLoader(false);
  };

  const [formation, setFormation] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  // const [signer, _] = useState<ethers.Signer>(
  //   (window as any).provider.getSigner()
  // );
  return (
    <div className={settingsStyles.settingsContainer}>
      <h2>Mint New NFTs</h2>
      <Link href="/mint">
        <a className={settingsStyles.link}>Mint</a>
      </Link>
      <h2>Set State Variables</h2>
      <h3>FutNFTTraining Smart Contract</h3>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>cooldown</span>
        <input
          type="number"
          name="cooldown"
          id="cooldown"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>seconds</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTTraining.connect(signer).setCooldown,
              parseInt(
                (document.getElementById("cooldown")! as HTMLInputElement).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>fee</span>
        <input
          type="number"
          name="fee"
          id="fee"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>MATIC</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTTraining.connect(signer).setFee,
              parseInt(
                (document.getElementById("fee")! as HTMLInputElement).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>maxLevel</span>
        <input
          type="number"
          name="maxLevel"
          id="maxLevel"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}></span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTTraining.connect(signer).setMaxLevel,
              parseInt(
                (document.getElementById("maxLevel")! as HTMLInputElement).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <h3>FutNFTMatch Smart Contract</h3>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>
          levelPercentSuitablePosition
        </span>
        <input
          type="number"
          name="levelPercentSuitablePosition"
          id="levelPercentSuitablePosition"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>%</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTMatch.connect(signer).setLevelPercentSuitablePosition,
              parseInt(
                (
                  document.getElementById(
                    "levelPercentSuitablePosition"
                  )! as HTMLInputElement
                ).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>levelPercentNoPosition</span>
        <input
          type="number"
          name="levelPercentNoPosition"
          id="levelPercentNoPosition"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>%</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTMatch.connect(signer).setLevelPercentNoPosition,
              parseInt(
                (
                  document.getElementById(
                    "levelPercentNoPosition"
                  )! as HTMLInputElement
                ).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>lineupFee</span>
        <input
          type="number"
          name="lineupFee"
          id="lineupFee"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>MATIC</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTMatch.connect(signer).setLineupFee,
              parseInt(
                (document.getElementById("lineupFee")! as HTMLInputElement)
                  .value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.item}>
        <span className={settingsStyles.variable}>matchFee</span>
        <input
          type="number"
          name="matchFee"
          id="matchFee"
          className={settingsStyles.value}
        />
        <span className={settingsStyles.unit}>MATIC</span>
        <button
          className={settingsStyles.setBtn}
          onClick={async () => {
            const provider: ethers.providers.Web3Provider = (window as any)
              .provider;
            const signer = provider.getSigner();
            await setValue(
              futNFTMatch.connect(signer).setMatchFee,
              parseInt(
                (document.getElementById("matchFee")! as HTMLInputElement).value
              )
            );
          }}
        >
          Set
        </button>
      </div>
      <div className={settingsStyles.formation}>
        <h4>Add Formation</h4>
        <input
          type="text"
          name="formationName"
          id="formationName"
          placeholder="Formation Name"
          onChange={() => {
            const formationName = (
              document.getElementById("formationName")! as HTMLInputElement
            ).value;
            setFormation(formationName);
            if (formationName.length == 0) {
              setPositions([]);
            }
          }}
        />
        {formation.length > 0 && (
          <>
            <div>
              <input
                type="text"
                name="position"
                id="position"
                placeholder="Position"
              />
              <button
                onClick={() => {
                  const position = (
                    document.getElementById("position")! as HTMLInputElement
                  ).value;
                  if (position.length > 0 && positions.length < 11) {
                    const newArr = positions;
                    newArr.push(position);
                    setPositions(newArr);
                  }
                }}
              >
                Add Position
              </button>
            </div>
            <div className={settingsStyles.positions}>
              {positions.map((position, key) => {
                return (
                  <div className={settingsStyles.position} key={key}>
                    <p>{position}</p>
                    <button
                      onClick={() => {
                        const index = positions.indexOf(position);
                        const newArr = positions;
                        newArr.splice(index, 1);
                        setPositions(newArr);
                      }}
                    >
                      ✗
                    </button>
                  </div>
                );
              })}
            </div>
            {positions.length == 11 && <button>Add Formation</button>}
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
