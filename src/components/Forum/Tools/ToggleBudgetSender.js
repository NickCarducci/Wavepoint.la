import React from "react";

class ToggleBudgetSender extends React.Component {
  render() {
    return (
      <div
        style={{
          breakInside: "avoid",
          display: "flex",
          width: "calc(100%)",
          backgroundColor: "rgb(20,20,20)",
          color: "white",
          height: "min-content"
        }}
      >
        <div
          style={{
            margin: "10px 0px",
            display: "flex",
            width: "calc(100% - 20px)",
            justifyContent: "space-evenly"
          }}
        >
          <div
            onClick={() => {
              this.props.openWhaat("council");
            }}
            style={
              this.props.openWhat === "council"
                ? {
                    display: "flex",
                    position: "relative",
                    borderBottom: "4px solid white"
                  }
                : {
                    display: "flex",
                    position: "relative"
                  }
            }
          >
            council
          </div>
          <div
            onClick={() => {
              console.log("voters");
              this.props.openWhaat("voters");
            }}
            style={
              this.props.openWhat === "voters"
                ? {
                    display: "flex",
                    position: "relative",
                    borderBottom: "4px solid white"
                  }
                : {
                    display: "flex",
                    position: "relative"
                  }
            }
          >
            voters
          </div>
        </div>
      </div>
    );
  }
}
export default ToggleBudgetSender;
