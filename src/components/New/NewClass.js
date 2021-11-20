import React from "react";
import firebase from "../.././init-firebase.js";
import Meets from "./Dates/Meets/index.js";
import Dates from "./Dates/index.js";
import NewMeet from "./Dates/NewMeet.js";

class NewClass extends React.Component {
  state = {
    message: "",
    body: "",
    meets: [],
    weekdays: [],
    minutesPercentage: 0,
    eow: false,
    predictions: []
  };
  checkComms = () => {
    firebase
      .firestore()
      .collection("classes")
      .where("communityId", "==", this.props.community.id)
      .where("message", "==", this.state.message)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          this.setState({
            chooseMeets: true
          });
        } else {
          querySnapshot.docs.forEach((doc) => {
            if (doc.exists) {
              const foo = doc.data();
              foo.id = doc.id;
              foo.endDate = new Date(foo.endDate.seconds * 1000);
              foo.startDate = new Date(foo.date.seconds * 1000);
              if (
                this.state.date > foo.endDate &&
                this.state.endDate < foo.startDate
              ) {
                this.setState({
                  chooseMeets: true
                });
              } else {
                console.log("comm has");
                this.setState({
                  pleaseNewClassname: this.props.community.id
                });
              }
            }
          });
        }
      })
      .catch((err) => console.log(err.message));
  };
  getTimeZone = (dt) => {
    return /\((.*)\)/.exec(new Date().toString())[1];
  };
  submit = () => {
    if (this.props.classTyped) {
      if (this.state.startDate) {
        this.checkComms();
      } else {
        window.alert("please choose when this class begins");
      }
    } else {
      window.alert("please select a filter");
    }
  };
  clear = () => {
    this.props.closeNew();
    this.setState({
      message: "",
      body: "",
      meets: [],
      weekdays: [],
      minutesPercentage: 0,
      eow: false,
      predictions: []
    });
  };
  render() {
    const { columncount } = this.props;
    var confirmable =
      this.state.timeStart &&
      this.state.rangeChosen &&
      this.state.weekdays.length > 0 &&
      this.state.classroom;
    return (
      <div
        style={{
          height: "min-content",
          padding: "10px 0px",
          backgroundColor: "rgb(230,230,230)",
          color: "rgb(20,20,20)",
          display: !this.props.showNew ? "none" : "flex",
          WebkitColumnBreakInside: "avoid",
          pageBreakInside: "avoid",
          breakInside: "avoid",
          zIndex: 6,
          width: "100%",
          maxHeight:
            columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
          position: "relative",
          flexDirection: "column",
          opacity: "1",
          borderBottom: "1px solid grey",
          overflowX: "hidden",
          overflowY: columncount === 1 ? "hidden" : "auto"
        }}
      >
        <div
          style={{
            display: "flex",
            color: "rgb(20,20,20)",
            fontSize: "14px",
            flexDirection: "column",
            position: "relative",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          <div
            style={{
              border: "1px solid",
              margin: "10px",
              padding: "10px",
              color: "navy",
              fontSize: "14px"
            }}
          >
            New Class&nbsp;
            {this.state.pleaseNewClassname &&
              "A class with this name is happening during this start date!"}
            {this.state.chooseMeets ? (
              this.state.message
            ) : (
              <input
                maxLength="15"
                className="input"
                value={this.state.message}
                onChange={(e) => {
                  if (this.state.pleaseNewClassname) {
                    this.setState({ pleaseNewClassname: "" });
                  }
                  this.setState({ message: e.target.value });
                }}
                placeholder="title"
                style={{
                  border: "2px solid navy",
                  color: "navy",
                  margin: "5px auto",
                  marginBottom: "10px",
                  breakInside: "avoid",
                  padding: "2px 5px",
                  borderRadius: "5px",
                  display: "flex",
                  resize: "vertical"
                }}
                required
              />
            )}
            <Dates
              chooseMeets={this.state.chooseMeets}
              setDates={(x) => this.setState(x)}
              endDate={this.state.endDate}
              startDate={this.state.startDate}
            />
            {this.state.chooseMeets ? (
              this.state.body
            ) : (
              <div
                style={{
                  borderTop: "1px solid rgb(160,160,160)",
                  top: "0px",
                  padding: "5px",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  minHeight: "30px",
                  color: "black",
                  flexDirection: "column",
                  fontSize: "15px"
                }}
              >
                <div
                  ref={this.textBox}
                  style={{
                    maxHeight: "70vh",
                    minHeight: "30px",
                    width: "calc(100% - 14px)",
                    position: "absolute",
                    zIndex: "-9999",
                    wordBreak: "break-all"
                  }}
                >
                  {this.state.body.split("\n").map((item, i) => (
                    <span key={i}>
                      {item}
                      <br />
                    </span>
                  ))}
                </div>
                <textarea
                  className="input"
                  value={this.state.body}
                  onChange={(e) =>
                    this.setState({ body: e.target.value }, () => {
                      if (this.textBox && this.textBox.current) {
                        var textBoxHeight = this.textBox.current.offsetHeight;
                        this.setState({
                          textBoxHeight
                        });
                      }
                    })
                  }
                  placeholder="motion"
                  style={{
                    height: this.state.textBoxHeight,
                    maxHeight: "70vh",
                    position: "relative",
                    resize: "none",
                    wordBreak: "break-all",
                    display: "flex",
                    top: "0px",
                    left: "0%",
                    backgroundColor: "white",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "20px",
                    textIndent: "10px",
                    minWidth: "98%",
                    maxWidth: "98%",
                    fontSize: "16px",
                    width: "80%",
                    marginBottom: "10px",
                    border: "2px solid navy",
                    color: "navy",
                    margin: "5px auto",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px"
                  }}
                  required
                />
              </div>
            )}
            {!this.state.chooseMeets && (
              <button
                style={{
                  padding: "3px",
                  backgroundColor: "rgb(0,30,60)",
                  color: "rgb(230,230,230)"
                }}
                onClick={this.submit}
              >
                Choose meeting times
              </button>
            )}
            <NewMeet
              changeClassroom={(e) =>
                this.setState({ classroom: e.target.value })
              }
              setWeekday={(x) => this.setState(x)}
              meets={this.state.meets}
              confirmable={confirmable}
              rangeChosen={this.state.rangeChosen}
              chooseMeets={this.state.chooseMeets}
            />
            {this.state.meets && (
              <Meets
                post={(add) => {
                  firebase
                    .firestore()
                    .collection("classes")
                    .add(add)
                    .catch((err) => console.log(err.message));
                }}
                meets={this.state.meets}
                chooseMeets={this.state.chooseMeets}
              />
            )}
          </div>
        </div>
        <div
          style={{
            height: "20px",
            display: "flex",
            position: "relative",
            width: "100%"
          }}
        >
          <div
            style={{
              border: "2px solid orange",
              display: "flex",
              right: "14px",
              position: "absolute"
            }}
            onClick={() => {
              if (
                this.state.message !== "" ||
                this.state.body !== "" ||
                this.state.meets.length > 0 ||
                this.state.weekdays.length > 0 ||
                this.state.minutesPercentage !== 0 ||
                this.state.eow !== false ||
                this.state.predictions.length > 0
              ) {
                var answer = window.confirm(
                  "delete class form progress? this cannot be undone"
                );
                if (answer) {
                  this.clear();
                }
              } else {
                this.clear();
              }
            }}
          >
            &times;
          </div>
        </div>
      </div>
    );
  }
}

export default NewClass;
