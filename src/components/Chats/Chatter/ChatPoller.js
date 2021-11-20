import React from "react";
import firebase from "../../.././init-firebase";
import { specialFormatting } from "../../../widgets/authdb";

class ChatPoller extends React.Component {
  state = {};
  render() {
    const { answers, addPoll } = this.props;
    return (
      <div
        onClick={() => {
          if (!addPoll) this.props.closeTopics();
        }}
        style={{
          display: "flex",
          position: "fixed",
          zIndex: "9999",
          opacity: this.state.seePollingHistory ? ".5" : "1",
          maxWidth: "100%",
          minWidth: addPoll ? "100px" : "0px",
          maxHeight: this.state.seePollingHistory ? "min-content" : "100vh",
          width: addPoll ? "min-content" : "34px",
          height: addPoll ? "calc(100% - 86px)" : "34px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          color: "white",
          top: "56px",
          right: "0px",
          fontSize: "18px",
          backgroundColor: "rgb(50,150,250)",
          border: "3px rgb(50,150,250) solid",
          borderRadius: "20px",
          transition: ".3s ease-in"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "min-content"
          }}
        >
          {addPoll && (
            <form>
              <div
                style={{
                  marginBottom: "2px",
                  color: "rgb(170,220,250)",
                  fontSize: "12px"
                }}
              >
                in {this.props.chosenTopic}&nbsp;
                {this.props.chosenTopic === "*" && "(General)"}
              </div>
              <div>
                <input
                  minLength="4"
                  onChange={(e) => {
                    var capped = specialFormatting(e.target.value);
                    if (
                      this.state.question &&
                      this.state.question.includes("?")
                    ) {
                      if (capped.includes("?")) {
                      } else {
                        this.setState({ question: capped });
                      }
                    } else {
                      this.setState({ question: capped });
                    }
                  }}
                  value={this.state.question}
                  className="input"
                  placeholder="Question"
                  style={{
                    textIndent: "2px",
                    border: "2px solid",
                    borderRadius: "5px",
                    width: "90%"
                  }}
                />
                <div
                  onClick={() =>
                    answers.length < 10 &&
                    (answers.length < 4 || answers.every((x) => x !== ""))
                      ? this.setState({
                          answers: [...this.state.answers, ""]
                        })
                      : this.setState({ showwarn: true })
                  }
                >
                  &nbsp;+
                </div>
              </div>
              {answers.map((x, i) => {
                return (
                  <div key={i} style={{ display: "flex" }}>
                    <div
                      style={{
                        marginTop: "2px",
                        marginRight: "2px",
                        alignItems: "center",
                        color: "rgb(150,200,250)",
                        fontSize: "14px"
                      }}
                    >
                      {i}
                    </div>
                    <input
                      onChange={(e) => {
                        var value = e.target.value;
                        if (this.state.showwarn)
                          this.setState({ showwarn: false });
                        var copy = [...this.state.answers];
                        copy[i] = value;
                        this.setState({
                          answers: copy
                        });
                      }}
                      className="input"
                      placeholder="Answer"
                      value={x}
                      style={{
                        border: "2px solid",
                        borderRadius: "5px",
                        width: "90%"
                      }}
                    />
                    <div
                      onClick={() => {
                        var copy = answers.filter((b) => b !== x);
                        if (this.state.showwarn)
                          this.setState({ showwarn: false });
                        this.setState({
                          answers: copy
                        });
                      }}
                    >
                      &nbsp;-
                    </div>
                  </div>
                );
              })}
              {this.state.showwarn && (
                <div
                  style={{
                    marginTop: "2px",
                    color: "rgb(170,220,250)",
                    fontSize: "12px"
                  }}
                >
                  please enter values to add more
                </div>
              )}
            </form>
          )}
          {addPoll && answers && (
            <div
              onClick={() => {
                if (answers.every((x) => x !== "")) {
                  if (
                    this.state.question &&
                    !this.state.question.includes("?")
                  ) {
                    window.alert(
                      "there is no question mark, please add one to send"
                    );
                  } else {
                    var threadId =
                      this.props.entityType +
                      this.props.entityId +
                      this.props.recipients.sort();
                    firebase
                      .firestore()
                      .collection("chats")
                      .add({
                        entityId: this.props.entityId,
                        entityType: this.props.entityType,
                        threadId,
                        authorId: this.props.auth.uid,
                        message: this.state.question,
                        answers: this.state.answers,
                        recipients: this.props.recipients,
                        topic: this.props.chosenTopic,
                        time: new Date()
                      })
                      .then(() => {
                        this.props.closePolls();
                        this.setState({
                          seePollingHistory: false,
                          question: "",
                          answers: []
                        });
                      });
                  }
                } else {
                  window.alert(
                    "please delete empty cells, and have at least 2 answers"
                  );
                }
              }}
              style={{
                fontSize:
                  this.state.question && answers.length > 1 ? "16px" : "10px",
                marginTop: "5px",
                color: "black",
                border: "1px solid",
                backgroundColor: "white",
                borderRadius: "20px",
                width: "max-content",
                opacity: this.state.question && answers.length > 1 ? "1" : ".5",
                padding: "4px 8px",
                transition: ".3s ease-in"
              }}
            >
              Send
            </div>
          )}
          <div
            style={{
              margin: "3px 0px",
              height: "7px",
              display: "flex",
              opacity: addPoll ? "0" : "1"
            }}
          >
            <div
              style={{
                height: "7px",
                width: "7px",
                borderRadius: "5px",
                backgroundColor: "white"
              }}
            />
            &nbsp;
            <div
              style={{
                height: "7px",
                width: "14px",
                padding: "0px 2px",
                borderRadius: "5px",
                backgroundColor: "white"
              }}
            />
          </div>
          <div
            style={{
              margin: "3px 0px",
              height: "7px",
              display: "flex",
              opacity: addPoll ? "0" : "1"
            }}
          >
            <div
              style={{
                height: "7px",
                width: "7px",
                padding: "0px 1px",
                borderRadius: "5px",
                backgroundColor: "white"
              }}
            />
            &nbsp;
            <div
              style={{
                height: "7px",
                width: "10px",
                borderRadius: "5px",
                backgroundColor: "white"
              }}
            />
          </div>
          {addPoll && (
            <div
              onClick={() => {
                if (addPoll) {
                  this.props.closePolls();
                  this.setState({
                    seePollingHistory: false
                  });
                }
              }}
              style={{
                backgroundColor: !addPoll ? "" : "rgb(20,20,20)",
                padding: "10px",
                borderRadius: "4px",
                position: addPoll ? "absolute" : "",
                top: addPoll ? "15px" : "",
                left: addPoll ? "25px" : "",

                height: addPoll ? "22px" : "7px",
                width: addPoll ? "22px" : "7px",
                display: "flex",
                transition: ".3s ease-in",
                zIndex: "9999"
              }}
            >
              <div
                style={{
                  position: addPoll ? "absolute" : "",
                  height: "7px",
                  width: addPoll ? "22px" : "7px",
                  transform: addPoll ? "rotate(-45deg)" : "rotate(0deg)",
                  padding: addPoll ? "" : "0px 2px",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  transition: ".3s ease-in"
                }}
              />
              &nbsp;
              <div
                style={{
                  position: addPoll ? "absolute" : "",
                  height: "7px",
                  width: addPoll ? "22px" : "14px",
                  transform: addPoll ? "rotate(45deg)" : "rotate(0deg)",
                  borderRadius: "5px",
                  backgroundColor: "white",
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
export default ChatPoller;
