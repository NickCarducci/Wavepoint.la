import React from "react";
import firebase from "../../../.././init-firebase.js";

class Tool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newmessage: "", testHeight: 0 };
    this.test = React.createRef();
  }
  componentDidMount = () => {
    if (this.props.b) {
      this.setState({ newmessage: this.props.b.message });
    }
  };
  componentDidUpdate = () => {
    if (this.state.newmessage !== this.state.lastnewmessage) {
      this.setState({
        lastnewmessage: this.state.newmessage,
        testHeight:
          this.test && this.test.current && this.test.current.offsetHeight
      });
    }
  };
  render() {
    const { b, mTT, commentType } = this.props;
    var time = b.time.seconds ? b.time.seconds * 1000 : b.time;
    var mT = mTT.constructor === Array ? mTT[mTT.length - 1] : mTT;
    var mess = mT ? String(mT) : "";
    var tooLong = mess > 200 && this.props.width < 700;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          position: "relative",
          width: "100%",
          minWidth: "40%",
          height: "min-content"
        }}
      >
        <div
          style={{
            top: "0px",
            color: "grey",
            fontSize: "8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            position: "relative",
            right: "0px",
            padding: "0px 3px"
          }}
        >
          {new Date(b.time.seconds * 1000).toLocaleString()}
        </div>
        <div
          onMouseLeave={() => this.setState({ hovering: false })}
          onMouseEnter={() => this.setState({ hovering: true })}
          style={{
            right: "0px",
            color: this.state.hovering ? "black" : "grey",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            position: "relative",
            borderTop: "1px solid grey"
          }}
        >
          {this.props.auth !== undefined &&
            this.props.auth.uid === b.authorId &&
            (![
              "budget & proposals",
              "elections",
              "oldBudget",
              "oldElections",
              "cases",
              "oldCases"
            ].includes(b.collection) ||
              new Date(time) > new Date()) && (
              <div
                style={{
                  width: "max-content",
                  fontSize: "12px",
                  border: "1px solid grey",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  padding: "0px 3px"
                }}
                onClick={
                  this.state.editing
                    ? this.state.newmessage !== mess
                      ? () => {
                          var messageAsArray = this.state.newmessage
                            .toLowerCase()
                            .replace(/[^\w\s0-9]/g, " ")
                            .replace(/(\r\n|\r|\n)/g, " ")
                            .split(" ");
                          firebase
                            .firestore()
                            .collection(commentType)
                            .doc(b.id)
                            .update({
                              messageAsArray,
                              message: this.state.newmessage
                            })
                            .catch((err) => console.log(err.message));
                          this.setState({ editing: false });
                        }
                      : () => this.setState({ editing: false })
                    : () => this.setState({ editing: true })
                }
              >
                {this.state.editing
                  ? mess === this.state.newmessage
                    ? "save"
                    : "save"
                  : "edit"}
              </div>
            )}
          {this.props.auth !== undefined &&
            this.props.auth.uid === b.authorId &&
            this.state.editing && (
              <div
                style={{
                  margin: "0px 4px",
                  fontSize: "12px",
                  border: "1px solid grey",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  right: "0px",
                  wordBreak: "break-all",
                  padding: "0px 3px"
                }}
                onClick={() => {
                  var answer = window.confirm("delete this comment?");
                  if (answer) {
                    firebase
                      .firestore()
                      .collection(commentType)
                      .doc(b.id)
                      .delete()
                      .then(() => {
                        firebase
                          .firestore()
                          .collection(this.props.chosenPost.collection)
                          .doc(this.props.chosenPost.id)
                          .update({
                            commentCount: firebase.firestore.FieldValue.increment(
                              -1
                            )
                          })
                          .then(() => {
                            console.log("deleted comment " + b.id);
                            this.setState({ comment: "" });
                          })
                          .catch((err) => console.log(err.message));
                      })
                      .catch((err) => console.log(err.message));
                    this.setState({ editing: false });
                  }
                }}
              >
                delete
              </div>
            )}
        </div>
        <div
          style={{
            height: "min-content",
            alignItems: "center",
            flexDirection: "column",
            marginRight: "5px",
            width: "calc(100% - 10px)",
            fontSize: "15px",
            display: "flex",
            position: "relative",
            minWidth: "20vw"
          }}
        >
          {this.state.editing ? (
            this.props.auth !== undefined &&
            this.props.auth.uid === b.authorId && (
              <div>
                <div ref={this.test}>
                  {this.state.newmessage.replace(/[\r|\r\n|\n]/g, <br />)}
                </div>
                <textarea
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: "100%",
                    height: this.state.testHeight,
                    resize: "none"
                  }}
                  maxLength={1000}
                  value={this.state.newmessage}
                  onChange={(e) => {
                    if (e.keyCode === 27)
                      return this.setState({ editing: false });
                    this.setState({ newmessage: e.target.value });
                  }}
                />
              </div>
            )
          ) : !tooLong ? (
            mess
          ) : (
            <span
              style={{
                height: "min-content",
                transition: ".3s ease-in"
              }}
            >
              <span
                style={{
                  color: this.state.openedLong ? "grey" : "black",
                  transition: ".3s ease-in"
                }}
              >
                {mess.substring(0, 199)}
              </span>
              <span
                style={{
                  fontSize: this.state.openedLong ? "" : "0px",
                  opacity: this.state.openedLong ? "1" : "0",
                  transition: ".3s ease-in"
                }}
              >
                {mess.substring(199, mess)}
              </span>
            </span>
          )}
          {tooLong && (
            <div
              style={{ zIndex: "9999" }}
              onClick={
                this.state.openedLong
                  ? () => this.setState({ openedLong: false })
                  : () => this.setState({ openedLong: true })
              }
            >
              <div
                style={{
                  marginTop: this.state.openedLong ? "5px" : "0px",
                  borderBottomRightRadius: "10px",
                  borderBottom: this.state.openedLong
                    ? "0px solid"
                    : "5px solid",
                  borderRight: this.state.openedLong
                    ? "0px solid"
                    : "5px solid",
                  borderTop: this.state.openedLong ? "5px solid" : "0px solid",
                  borderLeft: this.state.openedLong ? "5px solid" : "0px solid",
                  width: "10px",
                  height: "10px",
                  color: "grey",
                  transform: "rotate(45deg)",
                  transition: ".3s ease-in"
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Tool;
