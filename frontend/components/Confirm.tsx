import React from "react";
import confirmStyles from "../styles/Confirm.module.scss";

interface Props {
  handleYesClick: () => void;
  handleNoClick: () => void;
}

const Confirm: React.FunctionComponent<Props> = ({
  handleYesClick,
  handleNoClick,
}) => {
  return (
    <div className={confirmStyles.conform}>
      <div>
        <p>Are you sure?</p>
        <div>
          <button onClick={handleYesClick}>Yes</button>
          <button onClick={handleNoClick}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
