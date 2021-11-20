import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import NewLocationWidget from "./Meets/NewLocationWidget.js";
import Weekday from "./Weekday.js";
import TimeSpan from "./Meets/TimeSpan.js";
import Confirm from "./Meets/Confirm.js";

class NewMeet extends React.Component {
  render() {
    const { rangeChosen, chooseMeets, meets, confirmable } = this.props;
    var translate = rangeChosen === 1 ? "one hour" : "half hour";
    return (
      <div>
        {chooseMeets && (meets.length === 0 || this.state.openAnyway) && (
          <div>
            {/*
            <div style={{ fontSize: "15px", marginBottom: "5px" }}>
              Shift+click=multiple, Command+click=select
            </div>
            */}
            <Weekday
              weekdays={this.props.weekdays}
              setWeekday={this.props.setWeekday}
            />
            <div
              style={{
                breakInside: "avoid",
                display: "flex",
                width: "284px",
                backgroundColor: "rgb(40,30,20)",
                color: "white",
                height: "33px",
                marginBottom: "15px",
                alignItems: "center"
              }}
            >
              <input
                maxLength="15"
                value={this.props.classroom}
                onChange={this.props.changeClassRoom}
                className="input"
                style={{
                  height: "33px"
                }}
                placeholder="classroom"
              />
            </div>

            <NewLocationWidget
              goodplace_name={this.state.goodplace_name}
              goodCenter={this.state.goodCenter}
              place_name={this.state.place_name}
              likedCenter={this.state.likedCenter}
              good1={(x, y) =>
                this.setState({
                  place_name: x,
                  likedCenter: y
                })
              }
              good={(x, y, z, a) =>
                this.setState({
                  goodCenter: y,
                  goodplace_name: x,
                  place_name: z,
                  likedCenter: a
                })
              }
            />
          </div>
        )}
        {chooseMeets && (meets.length === 0 || this.state.openAnyway) && (
          <div
            style={{
              backgroundColor: "rgb(40,30,20)",
              color: "white",
              padding: "10px",
              margin: "15px -10px",
              marginLeft: "-20px",
              display: "flex",
              position: "relative",
              width: "100%",
              height: "min-content",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
          >
            <input
              onClick={() => this.props.setWeekday({ eow: true })}
              type="checkbox"
            />
            Every other week?
          </div>
        )}
        {chooseMeets && (meets.length === 0 || this.state.openAnyway) && (
          <div
            style={{
              backgroundColor: "rgb(40,30,20)",
              color: "white",
              padding: "10px",
              margin: "15px -10px",
              marginLeft: "-20px",
              display: "flex",
              position: "relative",
              width: "100%",
              height: "min-content",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
          >
            What time does it start?
            <br />
            <div
              style={{
                color: "rgb(200,200,250)",
                fontSize: "15px",
                marginBottom: "5px"
              }}
            >
              please select what it would be in your current local time
            </div>
            <div style={{ backgroundColor: "white" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker
                  label="Time"
                  value={this.state.timeStart}
                  onChange={(e) => {
                    console.log(e);
                    this.setState({ timeStart: e });
                  }}
                  onClose={() => {}}
                  onOpen={() => {}}
                  animateYearScrolling
                  disablePast={true}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        )}
        {chooseMeets && (meets.length === 0 || this.state.openAnyway) && (
          <TimeSpan setRange={(x) => this.setState(x)} translate={translate} />
        )}
        {confirmable && <Confirm />}
        {chooseMeets && meets.length > 0 && (
          <div
            style={{
              margin: "20px 0px",
              padding: "10px",
              backgroundColor: "rgb(20,20,40)",
              color: "white"
            }}
            onClick={() => this.setState({ openAnyway: true })}
          >
            +meeting
          </div>
        )}
      </div>
    );
  }
}
export default NewMeet;
