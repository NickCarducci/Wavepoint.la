import React from "react";
import Defaultable from "./Defaultable";

class Emails extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "calc(100% - 6px)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          backgroundColor: "rgb(170,220,250)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderTop: "1px solid",
          fontSize: "12px",
          color: "grey",
          padding: "3px"
        }}
      >
        {this.props.user.confirmedEmails.map((x, i) => {
          return (
            <Defaultable
              deleteStripe={this.props.deleteStripe}
              key={i}
              x={x}
              auth={this.props.auth}
              user={this.props.user}
            />
          );
        })}
      </div>
    );
  }
}
export default Emails;
