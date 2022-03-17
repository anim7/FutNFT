import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("VRFConsumer", async () => {
  let VRFConsumer: ContractFactory,
    vrfConsumer: Contract,
    owner: SignerWithAddress;
  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    VRFConsumer = await ethers.getContractFactory("VRFConsumer", owner);
    vrfConsumer = await VRFConsumer.deploy();
  });
  describe("test", async () => {
    it("test", async () => {
      const randNum = await vrfConsumer.randomResult();
      expect(randNum).to.equal(0);
    });
  });

  describe("Random Number", async () => {
    it("should set random number", async () => {
      await vrfConsumer.connect(owner).getRandomNumber();
      const randNum = vrfConsumer.randomResult();
      expect(randNum).to.not.equal(0);
    }).timeout(500000);
  });
});
