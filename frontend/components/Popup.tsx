import React from "react";
import popupStyles from "../styles/Popup.module.scss";

interface Props {
  handleClick: () => void;
}

const Popup: React.FunctionComponent<Props> = ({ handleClick }) => {
  return (
    <div className={popupStyles.popupContainer}>
      <div>
        <span>Price</span>
        <div>
          <input type="number" name="price" id="price" />
          <span>MATIC</span>
        </div>
        <button onClick={handleClick}>List Player</button>
      </div>
    </div>
  );
};

export default Popup;
