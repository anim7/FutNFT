import React from "react";
import alertStyles from "../styles/Alert.module.scss";

interface Props {
  message: string;
  okEnabled: boolean;
  id: string;
}

const Alert: React.FunctionComponent<Props> = ({ message, okEnabled, id }) => {
  return (
    <div className={alertStyles.alert} id={id}>
      <p>{message}</p>
      {okEnabled && (
        <button
          onClick={() => (document.getElementById(id)!.style.display = "none")}
        >
          OK
        </button>
      )}
    </div>
  );
};

export default Alert;
