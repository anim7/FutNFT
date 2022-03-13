import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, waffle } from "hardhat";

describe("FutNFTTraining", async () => {
  let FutNFTTraining: ContractFactory,
    futnftTraining: Contract,
    owner: SignerWithAddress,
    address1: SignerWithAddress,
    address2: SignerWithAddress;
  beforeEach(async () => {
    [owner, address1] = await ethers.getSigners();
    FutNFTTraining = await ethers.getContractFactory("FutNFTTraining", owner);
    futnftTraining = await FutNFTTraining.deploy();
  });

  describe("Train", async () => {
    it("should level up", async () => {
      await futnftTraining.connect(address1).mint({
        id: 2,
        name: "Neymar",
        age: 30,
        preferredPosition: "LW",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["ST", "CAM", "LMF", "LF"],
      });
      const player = await futnftTraining.getPlayer(2);
      const originalBalance = await waffle.provider.getBalance(
        address1.address
      );
      await futnftTraining.connect(address1).train(2, {
        value: ethers.utils.parseEther("0.001"),
      });
      const newBalance = await waffle.provider.getBalance(address1.address);
      const updatedPlayer = await futnftTraining.getPlayer(2);
      expect(player.level + 1).to.equal(updatedPlayer.level);
      expect(originalBalance > newBalance);
    });
    it("should not level up before cooldown is over", async () => {
      await futnftTraining.mint({
        id: 3,
        name: "Lewandowski",
        age: 33,
        preferredPosition: "ST",
        level: 19,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CF", "LW"],
      });
      await futnftTraining.train(3, {
        value: ethers.utils.parseEther("0.001"),
      });
      const res = await futnftTraining.train(3, {
        value: ethers.utils.parseEther("0.001"),
      });
      expect(res.wait()).to.be.revertedWith("Cooldown period is not over!");
    });
    it("should not level up if no ether is sent", async () => {
      await futnftTraining.mint({
        id: 4,
        name: "Van Dijk",
        age: 30,
        preferredPosition: "CB",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CDM", "RB"],
      });
      await expect(futnftTraining.train(4)).to.be.revertedWith(
        "Required fee is not sent!"
      );
    });
    it("should not level up if the owner doesn't train", async () => {
      await futnftTraining.connect(address1).mint({
        id: 5,
        name: "Kevin De Bruyne",
        age: 30,
        preferredPosition: "CAM",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CM"],
      });
      await expect(
        futnftTraining.train(5, { value: ethers.utils.parseEther("0.001") })
      ).to.be.revertedWith("Not the owner!");
    });
  });
  it("should not level up if the level is already 100", async () => {
    await futnftTraining.mint({
      id: 6,
      name: "Some God Player",
      age: 34,
      preferredPosition: "RW",
      level: 100,
      lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
      suitablePositions: ["ST", "CAM", "RMF", "RF", "CF"],
    });
    await expect(
      futnftTraining.train(6, { value: ethers.utils.parseEther("0.001") })
    ).to.be.revertedWith("Player has reached max level!");
  });
});
