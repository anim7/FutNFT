import React, { Component } from "react";
import homeStyles from "../styles/Home.module.scss";
import Alert from "./Alert";

interface Props {}
interface State {}

export class Home extends Component<Props, State> {
  render() {
    return (
      <>
        <Alert
          id="matchAlert"
          message="Cannot play! First buy enough players"
          okEnabled={true}
        />
        <div>Home</div>
      </>
    );
  }
}

export default Home;
