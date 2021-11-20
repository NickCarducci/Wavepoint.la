import React from "react";

class Types extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          height: this.props.width < 600 ? "52px" : "63px",
          transition: "maxHeight .3s ease-out"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "33.3vw",
            color: "grey",
            justifyContent: "center",
            alignItems: "center",
            fontSize: this.props.width < 600 ? "16px" : "20px"
          }}
        >
          <div
            onMouseEnter={() => this.props.setHover({ hoverElections: true })}
            onMouseLeave={() => this.props.setHover({ hoverElections: false })}
            style={{
              fontSize: !this.props.hoverElections ? "17px" : "",
              boxShadow: this.props.hoverElections
                ? "0px 0px 5px 1px grey"
                : "",
              border: "1px solid",
              padding: "5px 10px",
              borderRadius: "20px",
              transition: ".05s ease-in"
            }}
          >
            Elections
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "33.3vw",
            color: "grey",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            onMouseEnter={() => this.props.setHover({ hoverBills: true })}
            onMouseLeave={() => this.props.setHover({ hoverBills: false })}
            style={{
              fontSize: !this.props.hoverBills ? "17px" : "",
              boxShadow: this.props.hoverBills ? "0px 0px 5px 1px grey" : "",
              border: "1px solid",
              padding: "5px 10px",
              borderRadius: "20px",
              transition: ".05s ease-in"
            }}
          >
            Bills
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "33.3vw",
            color: "grey",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            onMouseEnter={() => this.props.setHover({ hoverCases: true })}
            onMouseLeave={() => this.props.setHover({ hoverCases: false })}
            style={{
              fontSize: !this.props.hoverCases ? "17px" : "",
              boxShadow: this.props.hoverCases ? "0px 0px 5px 1px grey" : "",
              border: "1px solid",
              padding: "5px 10px",
              borderRadius: "20px",
              transition: ".05s ease-in"
            }}
          >
            Cases
          </div>
        </div>
      </div>
    );
  }
}
export default Types;
