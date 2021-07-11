import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

class DateSlidster extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth; // * 0.01;
    let height = window.innerHeight; // * 0.01;
    this.state = {
      width,
      height,
      days: [],
      chooseSpanType: "duration",
      repeatableEvents: false
    };
    this.size = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        size: this.size.current && this.size.current.offsetHeight,
        width,
        height
      });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  render() {
    var translate = this.props.rangeChosen === 1 ? "one hour" : "half hour";
    return (
      <div
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          boxSizing: "border-box",
          position: "fixed",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          justifyContent: "center",
          boxShadow: "1px 0px 7px rgba(0, 0, 0, 0.5)",
          transform: !this.props.materialDateOpen
            ? "translateY(100%)"
            : "translateY(0%)",
          transition: "0.3s ease-out"
        }}
      >
        <div
          className="picker_backdrop"
          onClick={this.props.materialDateCloser}
          style={this.props.materialDateOpen ? {} : { display: "none" }}
        />
        {!this.props.forumOpen && (
          <div
            ref={this.size}
            style={{
              marginTop: "40px",
              bottom: this.state.size > this.state.height ? "" : "0px",
              padding: "10px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              backgroundColor: "white",
              display: "flex",
              position: "absolute",
              width: "calc(100% - 40px)",
              height: "min-content",
              flexDirection: "column"
            }}
          >
            {this.props.materialDateOpen && (
              <div
                onClick={this.props.backToPlanner}
                style={{
                  backgroundColor: "rgb(180,210,250)",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  position: "absolute",
                  right: "20px",
                  transform: "translateY(-43px)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Start
              </div>
            )}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end"
              }}
            >
              <div
                style={{
                  userSelect: "none",
                  padding: `4px 10px`
                }}
              >
                {" "}
                repeatable events
              </div>
              <div
                onClick={() =>
                  this.setState({
                    repeatableEvents: !this.state.repeatableEvents
                  })
                }
                style={{
                  userSelect: "none",
                  padding: `${this.state.repeatableEvents ? 4 : 4}px 10px`,
                  backgroundColor: `${
                    this.state.repeatableEvents
                      ? "rgb(200,200,220)"
                      : "rgb(200,200,200)"
                  }`,
                  color: this.state.repeatableEvents
                    ? "rgb(20,20,40)"
                    : "rgb(120,120,120)",
                  transition: ".3s ease-in"
                }}
              >
                {this.state.repeatableEvents ? "on" : "off"}
              </div>
            </div>
            <div
              style={{
                color: "rgb(100,100,100)",
                border: "1px solid rgb(200,200,200)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "4px 10px"
                }}
              >
                <div
                  onClick={() => {
                    this.setState({ chooseSpanType: "duration" });
                  }}
                  style={{
                    display: "flex",
                    textDecoration:
                      this.state.chooseSpanType === "duration"
                        ? "underline"
                        : "",
                    width: "calc(50% - 1px)",
                    borderRight: "1px solid"
                  }}
                >
                  duration
                </div>
                <div
                  onClick={() => {
                    this.setState({ chooseSpanType: "range" });
                  }}
                  style={{
                    borderLeft: "1px solid",
                    display: "flex",
                    textDecoration:
                      this.state.chooseSpanType === "range" ? "underline" : "",
                    width: "calc(50% - 1px)",
                    textIndent: "5px"
                  }}
                >
                  range
                </div>
              </div>
              <div
                style={{
                  padding: "4px 10px"
                }}
              >
                When do you plan on{" "}
                {window.location.pathname === "/newjob"
                  ? "making the hire?"
                  : "throwing the event?"}
              </div>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                label="Due Date"
                value={this.props.date}
                onChange={(e) => {
                  this.props.handleChangeDate(e);
                }}
                onClose={() => {
                  this.props.materialDateCloser();
                }}
                animateYearScrolling
                showTodayButton={true}
                disablePast={this.props.futureOnly}
              />
              <TimePicker
                label="Time"
                value={this.props.date}
                onChange={(e) => {
                  this.props.handleChangeDate(e);
                }}
                onClose={() => {
                  this.props.materialDateCloser();
                }}
                animateYearScrolling
                disablePast={this.props.futureOnly}
              />
            </MuiPickersUtilsProvider>
            <div
              style={{
                display: "flex"
              }}
            >
              {(window.location.pathname === "/newjob"
                ? ["six months", "year"]
                : ["one hour", "half hour"]
              ).map((x) => {
                return (
                  <div
                    key={x}
                    style={{
                      padding: "4px 10px",
                      display:
                        this.state.hours || this.state.minutes
                          ? "flex"
                          : "none",
                      position: "relative",
                      border: translate === x ? "1px solid teal" : "10px",
                      boxShadow:
                        translate === x ? "1px 0px 7px rgba(0, 0, 0, 0.5)" : ""
                    }}
                    onClick={() => {
                      var rangeChosen =
                        window.location.pathname === "/newjob"
                          ? "six months" === x
                            ? 4380
                            : 8760
                          : "one hour" === x
                          ? 1
                          : 0.5;
                      this.props.useRange(rangeChosen);
                    }}
                  >
                    {x}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display:
                  window.location.pathname === "/newjob" ||
                  this.state.chooseSpanType === "range"
                    ? "none"
                    : "flex"
              }}
            >
              <input
                max="24"
                type="number"
                className="input"
                value={this.state.hours}
                onChange={(e) => {
                  var hours = e.target.value;
                  var string = this.state.minutesPercentage.toString();
                  var rangeChosen =
                    Number(hours) + Number(string.substr(1, string.length - 1));
                  console.log(rangeChosen);
                  this.setState({ hours });
                  this.props.useRange(rangeChosen);
                }}
                placeholder="hours"
                style={{
                  padding: "4px 10px",
                  border: "1px solid rgb(200,200,200)",
                  width: "100%"
                }}
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
                  this.setState({ minutesPercentage });
                  var rangeChosen =
                    Number(this.state.hours) +
                    Number(string.substr(1, string.length - 1));
                  this.props.useRange(rangeChosen);
                }}
                placeholder="minutes"
                style={{
                  padding: "4px 10px",
                  border: "1px solid rgb(200,200,200)",
                  width: "100%"
                }}
              />
              <div
                onClick={() => this.setState({ minutes: "", hours: "" })}
                style={
                  this.state.hours || this.state.minutes
                    ? { border: "1px solid rgb(200,200,200)" }
                    : {
                        display: "none"
                      }
                }
              >
                &times;
              </div>
            </div>
            <div>
              <div
                style={{
                  flexWrap: "wrap",
                  display:
                    window.location.pathname !== "/newjob" ? "flex" : "none"
                }}
              >
                {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((x) => (
                  <div
                    key={x}
                    style={{
                      padding: "4px 10px",
                      border: `1px solid ${
                        this.state.days.includes(x)
                          ? "rgb(20,20,20)"
                          : "rgb(200,200,200)"
                      }`
                    }}
                    onClick={() => {
                      if (this.state.days.includes(x)) {
                        this.setState({
                          days: this.state.days.filter((y) => y !== x)
                        });
                      } else {
                        this.setState({
                          days: [...this.state.days, x]
                        });
                      }
                    }}
                  >
                    {x}
                  </div>
                ))}
              </div>
              <div style={{ color: "grey", padding: "4px", fontSize: "10px" }}>
                {" "}
                {window.location.pathname === "/newevent"
                  ? "select entity, photo and recipients next"
                  : "select entity, photo and recipients next"}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default DateSlidster;
