import React from "react";
import popupStyles from "../styles/Popup.module.scss";

interface Props {
  handleClick: () => void;
  handleCloseClick: () => void;
}

const Popup: React.FunctionComponent<Props> = ({
  handleClick,
  handleCloseClick,
}) => {
  return (
    <div className={popupStyles.popupContainer}>
      <div>
        <div className={popupStyles.top}>
          <span>Price</span>
          <button onClick={handleCloseClick}>✗</button>
        </div>
        <div className={popupStyles.middle}>
          <input type="number" name="price" id="price" />
          <span>MATIC</span>
        </div>
        <button onClick={handleClick}>List Player</button>
      </div>
    </div>
  );
};

export default Popup;
