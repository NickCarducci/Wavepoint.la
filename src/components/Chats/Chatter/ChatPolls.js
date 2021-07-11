import React from "react";
import ChatPoller from "./ChatPoller";

class ChatPolls extends React.Component {
  state = {
    addPoll: true
  };
  render() {
    const { answers, open } = this.props;
    return (
      <div style={{ display: "flex", flexDirection: "column", zIndex: "9999" }}>
        {" "}
        {open && this.state.addPoll && (
          <div
            onClick={() =>
              this.setState({ addPoll: false, seePollingHistory: false })
            }
            style={{
              zIndex: "9999",
              width: "100%",
              height: "100vh",
              display: "flex",
              position: "fixed",
              backgroundColor: "rgba(20,20,20,.4)"
            }}
          />
        )}
        {open && (
          <ChatPoller
            answers={answers}
            seePollingHistory={this.state.seePollingHistory}
            showPolling
            closeTopics={this.props.closeTopics}
            addPoll={this.props.addPoll}
            closePolls={this.props.closePolls}
            chosenTopic={this.props.chosenTopic}
          />
        )}
        {open && (
          <div
            onClick={() => this.setState({ seePollingHistory: true })}
            onMouseLeave={() => this.setState({ seePollingHistory: false })}
            style={
              this.state.seePollingHistory
                ? {
                    overflowX: "hidden",
                    overflowY: "auto",
                    flexDirection: "column",
                    display: "flex",
                    position: "fixed",
                    zIndex: "9999",
                    height: "calc(100% - 26px)",
                    maxWidth: "100%",
                    maxHeight: !this.state.seePollingHistory ? "56px" : "100vh",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "10px",
                    color: "black",
                    left: "0px",
                    fontSize: "18px",
                    backgroundColor: "rgb(240,240,240)",
                    border: "3px rgb(50,150,250) solid",
                    borderRadius: "20px",
                    transition: ".3s ease-in"
                  }
                : this.state.addPoll
                ? {
                    flexDirection: "column",
                    opacity: ".9",
                    display: "flex",
                    position: "fixed",
                    zIndex: "9999",
                    maxWidth: "100%",
                    maxHeight: !this.state.seePollingHistory ? "56px" : "100vh",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "10px",
                    color: "black",
                    left: "0px",
                    fontSize: "18px",
                    backgroundColor: "rgb(240,240,240)",
                    border: "3px rgb(50,150,250) solid",
                    borderRadius: "20px",
                    transition: ".3s ease-in"
                  }
                : {
                    flexDirection: "column",
                    opacity: ".0",
                    display: "flex",
                    position: "fixed",
                    zIndex: "9999",
                    width: "min-content",
                    height: "34px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "10px",
                    color: "black",
                    top: "-76px",
                    left: "0px",
                    fontSize: "18px",
                    backgroundColor: "rgb(240,240,240)",
                    border: "3px rgb(50,150,250) solid",
                    borderRadius: "20px",
                    transition: ".3s ease-in"
                  }
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "min-content"
              }}
            >
              Polls
              <div
                style={{
                  display: "flex",
                  backgroundColor: "white",
                  height: "80%",
                  width: "min-content",
                  borderRadius: "10px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    height: "80%",
                    width: "10px",
                    borderRadius: "10px"
                  }}
                />
                <div
                  style={{
                    border: "1px dashed",
                    padding: "3px",
                    paddingLeft: "0px",
                    marginLeft: "3px",
                    height: "80%",
                    marginRight: "30px",
                    display: !this.state.seePollingHistory ? "none" : "flex",
                    alignItems: "flex-start",
                    flexDirection: "column"
                  }}
                >
                  {this.props.recentChats.map((x, i) => {
                    if (x.answers && x.answers.length > 0) {
                      return (
                        <div key={i} style={{ display: "flex" }}>
                          <div
                            style={{
                              padding: "2px 4px",
                              marginTop: "2px",
                              marginRight: "2px",
                              alignItems: "center",
                              color: "black",
                              fontSize: "14px"
                            }}
                          >
                            {x.topic}
                          </div>
                          <div
                            style={{
                              border: "2px solid",
                              borderRadius: "5px"
                            }}
                          >
                            {x.message}
                          </div>
                          <div
                            style={{
                              border: "2px solid",
                              borderRadius: "5px"
                            }}
                          >
                            {x.answers.map((y) => {
                              return <div key={y}>{y}</div>;
                            })}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "min-content",
                              width: "min-content",
                              border: "3px solid",
                              borderRadius: "5px"
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "min-content",
                                width: "min-content",
                                border: "2px solid rgb(250,250,200)"
                              }}
                            >
                              <div
                                style={{
                                  height: "12px",
                                  width: "12px",
                                  border: "2px solid",
                                  borderRadius: "5px"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    } else return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default ChatPolls;
