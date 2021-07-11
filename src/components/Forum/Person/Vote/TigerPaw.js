import React from "react";

class TigerPaw extends React.Component {
  render() {
    return (
      <div
        style={{
          opacity: this.props.swipe !== "paw" ? "1" : ".7",
          position: "absolute",
          width: "22px",
          height: "22px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform:
            this.props.swipe === "paw" ? `rotate(${90}deg)` : `rotate(0deg)`,
          transition: ".3s ease-in"
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((x) => (
          <div
            key={x}
            //333
            style={{
              width: "3px",
              position: "absolute",
              backgroundColor: "blue",
              height: "22px",
              transform:
                this.props.swipe === "paw"
                  ? `rotate(${(x / 6) * 360}deg)`
                  : `rotate(${(x / 6) * 180}deg)`,
              transition: ".3s ease-in"
            }}
          ></div>
        ))}
      </div>
    );
  }
}

export default TigerPaw;

/**
 * 
        <div style={{ zIndex: "1", position: "relative", width: "100vw" }}>
          <div
            style={{
              opacity: !this.props.closeHeader ? "1" : ".7",
              display: "flex",
              position: "absolute",
              right: "110px",
              top: "15px",
              width: "30px",
              height: "30px",
              justifyContent: "center",
              alignItems: "center",
              transform: this.props.closeHeader
                ? `rotate(${90}deg)`
                : `rotate(0deg)`,
              transition: ".3s ease-in"
            }}
            onClick={this.props.toggleHeader}
          >
            {[1, 2, 3, 4, 5, 6].map((x) => (
              <div
                key={x}
                //333
                style={{
                  width: "3px",
                  position: "absolute",
                  backgroundColor: "blue",
                  height: "30px",
                  transform: !this.props.closeHeader
                    ? `rotate(${180}deg)`
                    : `rotate(${(x / 6) * 180}deg)`,
                  transition: ".3s ease-in"
                }}
              ></div>
            ))}
          </div>
        </div>
 */
