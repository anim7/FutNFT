import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("FutNFT", async () => {
  let FutNFT: ContractFactory,
    futnft: Contract,
    owner: SignerWithAddress,
    address1: SignerWithAddress;
  beforeEach(async () => {
    [owner, address1] = await ethers.getSigners();
    FutNFT = await ethers.getContractFactory("FutNFT", owner);
    futnft = await FutNFT.deploy();
  });

  describe("Deployment", async () => {
    it("should set name to FutNFT", async () => {
      const name = await futnft.name();
      expect(name).to.equal("FutNFT");
    });
    it("should set symbol to FNFT", async () => {
      const symbol = await futnft.symbol();
      expect(symbol).to.equal("FNFT");
    });
  });

  describe("Minting", async () => {
    it("should add new player", async () => {
      await futnft.mint({
        id: 0,
        name: "Messi",
        age: 34,
        preferredPosition: "RW",
        level: 20,
        lastUpgrade: Math.round(new Date().getTime() / 1000),
        suitablePositions: ["ST", "CAM", "RMF", "RF", "CF"],
      });
      const player = await futnft.getPlayer(0);
      expect(player.name).to.equal("Messi");
    });
    it("should not add the same player", async () => {
      const res = await futnft.mint({
        id: 0,
        name: "Messi",
        age: 34,
        preferredPosition: "RW",
        level: 20,
        lastUpgrade: Math.round(new Date().getTime() / 1000),
        suitablePositions: ["ST", "CAM", "RMF", "RF", "CF"],
      });
      expect(res.wait()).to.be.revertedWith("Player Exists!");
    });
    it("makes the correct owner", async () => {
      await futnft.connect(address1).mint({
        id: 1,
        name: "Ronaldo",
        age: 37,
        preferredPosition: "ST",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000),
        suitablePositions: ["CF", "LF", "LW"],
      });
      const sender = await futnft.ownerOf(1);
      expect(sender).to.equal(address1.address);
    });
  });
});
