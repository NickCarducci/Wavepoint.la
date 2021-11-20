import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

class IfEvents extends React.Component {
  state = { searchedDate: new Date() };
  render() {
    const { openCal, started } = this.props;
    var loadedSearch =
      new Date(this.props.current).setHours(0, 0, 0, 0) ===
      new Date(this.state.searchedDate).setHours(0, 0, 0, 0);
    var open = openCal || (!started && !openCal);
    return (
      <div
        onMouseEnter={() => this.setState({ hoverCal: true })}
        onMouseLeave={() => this.setState({ hoverCal: false })}
        onClick={() => !openCal && this.props.setFoundation({ openCal: true })}
        style={{
          width: "100%",
          position: "relative",
          opacity: open ? 1 : 0,
          height: !open ? "0px" : "min-content",
          backgroundColor: `rgb(20,20,20)`,
          transition: `${started ? ".1" : ".3"}s ease-in`
        }}
      >
        <div
          style={{
            width: "100%",
            position: "absolute",
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.878), rgba(0, 0, 0, 0.878))",
            borderRadius: "5px"
          }}
        >
          <Calendar
            minDate={new Date()}
            onChange={(e) => {
              var queriedDate = e[0];
              var range = e[1] - e[0];
              this.props.setData({
                queriedDate,
                range,
                current: e[0],
                current1: e[1]
              });
            }}
            value={[
              new Date(this.props.current),
              new Date(this.props.current1)
            ]}
            selectRange={true}
          />
          <div style={{ display: "flex" }}>
            <div
              onClick={() => this.props.setFoundation({ openCal: false })}
              style={{
                padding: "10px 0px",
                textAlign: "center",
                fontSize: "20px",
                position: "relative",
                width: "calc(100% - 2px)",
                color: "white",
                border: "1px solid white",
                backgroundImage:
                  "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
              }}
            >
              Close
            </div>
            <div
              style={{
                padding: !loadedSearch ? "10px 0px" : "0px 0px",
                textAlign: "center",
                fontSize: !loadedSearch ? "20px" : "0px",
                position: "relative",
                width: !loadedSearch ? "calc(100% - 2px)" : "0px",
                color: "white",
                border: "1px solid white",
                backgroundImage:
                  "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
              }}
              onClick={() => {
                this.setState(
                  {
                    searchedDate: this.props.current
                  },
                  () => {
                    this.props.setFoundation({ openCal: false });
                    //this.props.start();
                    this.props.queryDate([
                      this.props.current,
                      this.props.current1
                    ]);
                  }
                );
              }}
            >
              Start Search
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default IfEvents;
