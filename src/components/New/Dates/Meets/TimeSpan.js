import React from "react";

class TimeSpan extends React.Component {
  render() {
    const { translate } = this.props;
    var hide = this.state.hours || this.state.minutesPercentage;
    return (
      <div
        style={{
          backgroundColor: "rgb(40,30,20)",
          color: "white",
          padding: "10px",
          display: "flex",
          position: "relative",
          width: "100%",
          height: "min-content",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        How long will this meeting last?
        {["one hour", "half hour"].map((x) => {
          return (
            <div
              key={x}
              style={
                hide
                  ? { display: "none" }
                  : translate === x
                  ? {
                      marginTop: "10px",
                      display: "flex",
                      position: "relative",
                      padding: "10px",
                      border: "1px solid teal",
                      boxShadow: "1px 0px 7px rgba(0, 0, 0, 0.5)"
                    }
                  : {
                      marginTop: "10px",
                      display: "flex",
                      position: "relative",
                      padding: "10px",
                      border: "none"
                    }
              }
              onClick={() => {
                var rangeChosen = "one hour" === x ? 1 : 0.5;
                this.props.setRange({ rangeChosen });
              }}
            >
              {x}
            </div>
          );
        })}
        <div
          style={{
            position: "relative",
            marginTop: "10px",
            display: "flex"
          }}
        >
          <input
            onKeyDown={() => false}
            max="24"
            type="number"
            className="input"
            value={this.state.hours}
            onChange={(e) => {
              var hours = e.target.value;
              var string = this.state.minutesPercentage.toString();
              var rangeChosen =
                Number(hours) + Number(string.substr(1, string.length - 1));
              this.props.setRange({ rangeChosen, hours });
            }}
            placeholder="hours"
            style={{ width: "100%" }}
          />
          <input
            max="59"
            type="number"
            className="input"
            value={this.state.minutes}
            onChange={(e) => {
              var minutes = e.target.value;
              var minutesPercentage = minutes / 60;
              var string = minutesPercentage.toString();
              var rangeChosen =
                Number(this.state.hours) +
                Number(string.substr(1, string.length - 1));
              this.props.setRange({ rangeChosen, minutesPercentage });
            }}
            placeholder="minutes"
            style={{ width: "100%" }}
          />
          <div
            onClick={() => this.setState({ minutes: "", hours: "" })}
            style={hide ? {} : { display: "none" }}
          >
            &times;
          </div>
        </div>
      </div>
    );
  }
}
export default TimeSpan;
