import React from "react";

class NewNotif extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "10px",
          right: "0px",
          transform: "translate(100%,0%)",
          fontSize: "10px",
          color: "#999",
          width: "50px",
          height: "5px",
          borderRadius: "90px"
          //backgroundColor: "red"
        }}
      >
        New
      </div>
    );
  }
}
export default NewNotif;
