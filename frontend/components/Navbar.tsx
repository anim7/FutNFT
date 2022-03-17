import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import navStyles from "../styles/Navbar.module.scss";
import { handleLinkClick } from "../utils/navUtils";
import Alert from "./Alert";

interface Props {
  account: string;
}

const Navbar: React.FunctionComponent<Props> = ({ account }) => {
  const router = useRouter();
  useEffect(() => {
    if (router.asPath == "/") {
      handleLinkClick("homeLink", navStyles.link, navStyles.activeLink, false);
    } else if (router.asPath == "/about") {
      handleLinkClick("aboutLink", navStyles.link, navStyles.activeLink, false);
    }
  }, [router.asPath]);

  return (
    <>
      <Alert message="Copied!" okEnabled={false} id="copied" />
      <nav className={navStyles.navContainer}>
        <div className={navStyles.leftContainer}>
          <h1 className={navStyles.logo}>
            <Link href="/">
              <a>LOGO</a>
            </Link>
          </h1>
          <ul className={navStyles.links}>
            <li className={navStyles.link} id="homeLink">
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className={navStyles.link} id="aboutLink">
              <Link href="/about">
                <a>About</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={navStyles.rightContainer}>
          <button
            className={navStyles.address}
            onClick={() => {
              navigator.clipboard.writeText(account);
              document.getElementById("copied")!.style.display = "inline-block";
              setTimeout(() => {
                document.getElementById("copied")!.style.display = "none";
              }, 2000);
            }}
          >
            {account.length > 3
              ? account.substring(0, 5) +
                "..." +
                account.substring(account.length - 5)
              : account}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
