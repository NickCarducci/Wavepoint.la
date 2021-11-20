import React from "react";

class Zoomer extends React.Component {
  state = {};
  render() {
    const { zoomChosen } = this.props;
    const zoomArray = [8, 11, 14, 17];
    return (
      <div
        className="mapzoom1"
        onMouseLeave={() =>
          this.setState({
            hover8: false,
            hover11: false,
            hover14: false,
            hover17: false
          })
        }
      >
        {zoomArray.map((x, i) => {
          return (
            <div
              key={x}
              onMouseEnter={() => this.setState({ ["hover" + x]: true })}
              onClick={() => {
                const lio = zoomArray.lastIndexOf(zoomChosen);
                if (lio - i > 1) {
                  const fa = zoomArray[lio - 1];
                  if (fa) {
                    this.props.clickZoomer(fa);
                  } else this.props.clickZoomer(8);
                } else this.props.clickZoomer(x);
              }}
              style={{
                alignItems: "center",
                color: this.state["hover" + x] ? "black" : "rgb(8,8,8)",
                display: "flex",
                opacity:
                  zoomChosen === x
                    ? "1"
                    : this.state["hover" + x]
                    ? ".5"
                    : ".3",
                transition: ".1s ease-in"
              }}
            >
              {
                [
                  //worldview,
                  "scope",
                  "buildings",
                  "roads",
                  "street"
                ][i]
              }
              &nbsp;
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor:
                    zoomChosen === x ? "rgb(8,8,8)" : "rgba(0,0,0,0)",

                  transition: ".3s ease-in"
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
export default Zoomer;
