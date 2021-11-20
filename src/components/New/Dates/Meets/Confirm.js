import React from "react";

class Confirm extends React.Component {
  render() {
    return (
      <div>
        <div>{this.state.eow ? "every other week" : "every week"}</div>
        <div>
          {this.state.weekdays.map((x) => {
            return <div>{x}</div>;
          })}
        </div>
        <div>{new Date(this.state.timeStart).toLocaleTimeString()}</div>
        <div>{this.getTimeZone(new Date(this.state.timeStart))}</div>
        <div>{this.state.rangeChosen} hours</div>
        <div>{this.state.classroom}</div>
        <div>{this.state.goodCenter}</div>
        <div
          style={{ marginTop: "20px" }}
          onClick={() => {
            if (this.state.goodplace_name) {
              this.setState({
                meets: [
                  ...this.state.meets,
                  {
                    eow: this.state.eow,
                    timeStart: this.state.timeStart,
                    days: this.state.weekdays,
                    times: this.state.rangeChosen,
                    classroom: this.state.classroom,
                    goodCenter: this.state.goodCenter
                  }
                ]
              });
              this.setState({
                eow: false,
                weekdays: [],
                rangeChosen: "",
                timeStart: ""
              });
            } else {
              window.alert("please choose the nearest address for the map");
            }
          }}
        >
          Confirm meeting
        </div>
      </div>
    );
  }
}
export default Confirm;
