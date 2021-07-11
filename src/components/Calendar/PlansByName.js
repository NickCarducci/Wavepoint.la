import React from "react";
import { Link } from "react-router-dom";
import firebase from "../.././init-firebase";
import PlanObject from "./Invites/PlanObject";
import "./Day/DayCalBackdrop.css";

class PlansByName extends React.Component {
  state = {
    notes: [],
    plansByName: [],
    plansByThread: [],
    plansByTopic: [],
    hasChat: []
  };

  componentDidMount = () => {
    const pathname = window.location.pathname;
    const f = pathname.split("/plans/")[1];
    var result = f.replace(/%20/g, " ");
    this.setState({ pathname: f, result });
    let l = 0;
    let notes = [];
    this.props.notes.map((x) => {
      l++;
      if (x.message.toLowerCase() === result.toLowerCase()) {
        notes.push(x);
      }
      if (l === this.props.notes.length) {
        this.setState({ notes });
      }
      return x;
    });
    if (this.props.auth !== undefined)
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "array-contains", this.props.auth.uid)
        .where("message", "==", result)
        .orderBy("date")
        .onSnapshot((docs) => {
          let goo = [];
          var gee = 0;
          docs.forEach((doc) => {
            gee++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              firebase
                .firestore()
                .collection("chats")
                .where("recipients", "array-contains", this.props.auth.uid)
                .where("topic", "==", foo.topic)
                .orderBy("date")
                .onSnapshot((docs) => {
                  let goo = [];
                  var gee = 0;
                  docs.forEach((doc) => {
                    gee++;
                    if (doc.exists) {
                      var boo = doc.data();
                      boo.id = doc.id;
                      goo.push(boo);
                      if (gee === docs.length) {
                        foo.plansByThread = goo;
                      }
                    }
                  });
                });
              goo.push(foo);
              if (gee === docs.length) {
                let hasChat = [];
                goo.map((x) => {
                  const gotit = notes.find((y) => y._id === x.id);
                  if (gotit) {
                    return hasChat.push(gotit);
                  } else return null;
                });
                this.setState({ plansByName: goo, result, hasChat });

                firebase
                  .firestore()
                  .collection("chats")
                  .where("recipients", "array-contains", this.props.auth.uid)
                  .where("topic", "==", result)
                  .onSnapshot((docs) => {
                    let goo = [];
                    var gee = 0;
                    docs.forEach((doc) => {
                      gee++;
                      if (doc.exists) {
                        var foo = doc.data();
                        foo.id = doc.id;
                        goo.push(foo);
                        if (gee === docs.length) {
                          this.setState({ plansByTopic: goo });
                        }
                      }
                    });
                  });
              }
            }
          });
        });
  };
  render() {
    let noteList = [];
    let noteTitles = [];
    this.props.notes.map((x) => {
      noteTitles.push(x.message);
      return noteList.push(x._id);
    });
    return (
      <div
        style={{
          backgroundColor: "rgba(250,250,250,.877)",
          display: "flex",
          position: "fixed",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          overflowX: "hidden",
          zIndex: "9999"
        }}
      >
        <div
          style={{
            display: "flex",
            left: "0px",
            position: "absolute",
            width: "100%",
            flexDirection: "column"
          }}
        >
          Plans by the name {this.state.result}
          <br />
          {this.state.plansByName === [] &&
            "no invites or backed-up plans by this name"}
          <br />
          {this.state.notes === [] && "no local plans by this name"}
          <br />
          <div
            ref={this.size}
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              height: "300px",
              right: "0px",
              bottom: "0px",
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "white"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "flex-start",
                top: "0px",
                bottom: "56px",
                marginBottom: "10px",
                height: "min-content",
                textDecoration: "none"
              }}
            >
              {this.state.notes.map((x) => {
                var backedUp = this.state.hasChat.find((y) => y.id === x._id);
                if (backedUp) {
                  return <div>backed up{x.message}</div>;
                } else
                  return (
                    <PlanObject
                      open={(x) => {
                        console.log(x);
                        this.setState({ opened: x });
                      }}
                      auth={this.props.auth}
                      opened={this.state.opened}
                      onDelete={this.props.onDelete}
                      handleSave={this.props.handleSave}
                      notes={this.props.notes}
                      chooseInvite={this.props.chooseInvite}
                      note={x}
                      noteTitles={noteTitles}
                      noteList={noteList}
                    />
                  );
              })}
            </div>
          </div>
          <br />
          {this.state.plansByThread === [] &&
            "no invites or backed-up plans using this topic"}
          <br />
          {this.state.plansByThread.map((x) => {
            return <div>backed up{x.message}</div>;
          })}
          <br />
          {this.state.plansByTopic === [] &&
            "no invites or backed-up plans using this topic"}
          <br />
          {this.state.plansByTopic.map((x) => {
            return <div>backed up{x.message}</div>;
          })}
        </div>
        {this.props.location.state && this.props.location.state.planid ? (
          <Link
            to={`/plan/${this.props.location.state.planid}`}
            style={{
              display: "flex",
              position: "fixed",
              top: "10px",
              right: "40px",
              width: "20px",
              height: "20px",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #444"
            }}
          >
            &times;
          </Link>
        ) : (
          <Link
            to={`/`}
            style={{
              display: "flex",
              position: "fixed",
              top: "10px",
              right: "40px",
              width: "20px",
              height: "20px",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #444"
            }}
          >
            &times;
          </Link>
        )}
      </div>
    );
  }
}
export default PlansByName;
