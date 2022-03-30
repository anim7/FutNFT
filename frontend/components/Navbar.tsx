import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";
import navStyles from "../styles/Navbar.module.scss";
import { getOwner } from "../utils/getOwner";
import { handleLinkClick } from "../utils/navUtils";
import Alert from "./Alert";

interface Props {
  account: string;
  blockchainDataLoaded: boolean;
  futNFTMatch: ethers.Contract;
}
interface State {
  owner: string;
}

const Navbar: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  useEffect(() => {
    if (router.asPath == "/") {
      handleLinkClick("homeLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath === "/buy") {
      handleLinkClick("buyLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath === "/sell") {
      handleLinkClick("sellLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath === "/train") {
      handleLinkClick("trainLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath === "/play") {
      handleLinkClick("playLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath === "/settings") {
      handleLinkClick(
        "settingsLink",
        navStyles.link,
        navStyles.activeLink,
        false
      );
    }
  }, [router.asPath]);
  return <NavbarClass {...props} />;
};

class NavbarClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      owner: "0x0",
    };
  }

  async componentDidMount() {
    if (this.props.blockchainDataLoaded) {
      this.setState({ owner: await getOwner(this.props.futNFTMatch) });
    }
  }

  async componentDidUpdate() {
    if (this.props.blockchainDataLoaded) {
      this.setState({ owner: await getOwner(this.props.futNFTMatch) });
    }
  }

  render() {
    return (
      <>
        <nav className={navStyles.navContainer}>
          <div className={navStyles.leftContainer}>
            <h1 className={navStyles.logo}>
              <Link href="/">
                <a>FutNFT</a>
              </Link>
            </h1>
            <ul className={navStyles.links}>
              <li className={navStyles.link} id="homeLink">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className={navStyles.link} id="buyLink">
                <Link href="/buy">
                  <a>Buy Players</a>
                </Link>
              </li>
              <li className={navStyles.link} id="sellLink">
                <Link href="/sell">
                  <a>Sell Players</a>
                </Link>
              </li>
              <li className={navStyles.link} id="trainLink">
                <Link href="/train">
                  <a>Train</a>
                </Link>
              </li>
              <li className={navStyles.link} id="playLink">
                <Link href="/play">
                  <a>Match</a>
                </Link>
              </li>
              {this.state.owner.toLowerCase() ===
                this.props.account.toLowerCase() && (
                <li className={navStyles.link} id="settingsLink">
                  <Link href="/settings">
                    <a>Settings</a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className={navStyles.rightContainer}>
            <button
              className={navStyles.address}
              onClick={() => {
                navigator.clipboard.writeText(this.props.account);
                document.getElementById("copied")!.style.display =
                  "inline-block";
                setTimeout(() => {
                  document.getElementById("copied")!.style.display = "none";
                }, 2000);
              }}
            >
              {this.props.account?.length > 3
                ? this.props.account.substring(0, 5) +
                  "..." +
                  this.props.account.substring(this.props.account.length - 5)
                : this.props.account}
            </button>
          </div>
        </nav>
        <Alert message="Copied!" okEnabled={false} id="copied" />
      </>
    );
  }
}

export default Navbar;
