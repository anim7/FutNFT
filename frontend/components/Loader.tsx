import Image from "next/image";
import React from "react";
import loaderStyles from "../styles/Loader.module.scss";

interface Props {}

const Loader: React.FunctionComponent<Props> = () => {
  return (
    <div className={loaderStyles.loaderContainer}>
      <Image src="/loader.gif" alt="Loader" width={70} height={70} />
    </div>
  );
};

export default Loader;
