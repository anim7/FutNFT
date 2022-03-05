import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("Token", async () => {
  let Token: ContractFactory, token: Contract, owner: SignerWithAddress;
  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token", owner);
    token = await Token.deploy();
  });

  describe("Deployment", async () => {
    it("should set the value of token", async () => {
      const tokenName = await token.tokenName();
      expect(tokenName).to.equal("Token");
    });
  });

  describe("setter", async () => {
    it("should set the value of token using setter", async () => {
      await token.setTokenName("TokenName");
      const tokenName = await token.tokenName();
      expect(tokenName).to.equal("TokenName");
    });
  });
});
