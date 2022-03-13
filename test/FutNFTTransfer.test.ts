import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("FutNFTTransfer", async () => {
  let FutNFTTransfer: ContractFactory,
    futnftTransfer: Contract,
    owner: SignerWithAddress,
    address1: SignerWithAddress,
    address2: SignerWithAddress;
  beforeEach(async () => {
    [owner, address1, address2] = await ethers.getSigners();
    FutNFTTransfer = await ethers.getContractFactory("FutNFTTransfer", owner);
    futnftTransfer = await FutNFTTransfer.deploy();
  });

  describe("Transfer", async () => {
    it("should list player", async () => {
      await futnftTransfer.mint({
        id: 7,
        name: "Mbappe",
        age: 23,
        preferredPosition: "ST",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CF", "LW", "LF"],
      });
      await futnftTransfer.list(7);
      const listed = await futnftTransfer.listedOnMarket(7);
      expect(listed).to.equal(true);
    });
    it("should unlist player", async () => {
      await futnftTransfer.mint({
        id: 8,
        name: "Jorginho",
        age: 30,
        preferredPosition: "CM",
        level: 15,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CDM"],
      });
      await futnftTransfer.list(8);
      await futnftTransfer.unlist(8);
      const listed = await futnftTransfer.listedOnMarket(7);
      expect(listed).to.equal(false);
    });
    it("should not list when the player is already listed and should not unlist when the player is not listed", async () => {
      await futnftTransfer.mint({
        id: 9,
        name: "Foden",
        age: 22,
        preferredPosition: "LW",
        level: 14,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["ST", "CF", "CM", "CAM"],
      });
      await expect(futnftTransfer.unlist(9)).to.be.revertedWith(
        "This player is not listed on the market!"
      );
      await futnftTransfer.list(9);
      await expect(futnftTransfer.list(9)).to.be.revertedWith(
        "This player is already listed on the market!"
      );
    });
    it("should be listed/unlisted only by the owner", async () => {
      await futnftTransfer.connect(address1).mint({
        id: 10,
        name: "Kante",
        age: 30,
        preferredPosition: "CM",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["CDM"],
      });
      await expect(futnftTransfer.list(10)).to.be.revertedWith(
        "Not the owner!"
      );
      await futnftTransfer.connect(address1).list(10);
      await expect(futnftTransfer.unlist(10)).to.be.revertedWith(
        "Not the owner!"
      );
    });
    it("should transfer ownership", async () => {
      await futnftTransfer.connect(address1).mint({
        id: 11,
        name: "Ruben Dias",
        age: 26,
        preferredPosition: "CB",
        level: 17,
        lastUpgrade: Math.round(new Date().getTime() / 1000) - 433000,
        suitablePositions: ["NA"],
      });
      await expect(
        futnftTransfer.connect(address1).transferPlayer(address2.address, 11)
      ).to.be.revertedWith("This player is not listed on the market!");
      await futnftTransfer.connect(address1).list(11);
      await expect(
        futnftTransfer.transferPlayer(address2.address, 11)
      ).to.be.revertedWith("Not the owner!");
      await futnftTransfer
        .connect(address1)
        .transferPlayer(address2.address, 11);
      const ownerOfPlayer = await futnftTransfer.ownerOf(11);
      expect(ownerOfPlayer).to.equal(address2.address);
    });
  });
});
