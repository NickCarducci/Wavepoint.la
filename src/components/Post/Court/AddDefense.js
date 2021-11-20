import React from "react";
import firebase from "../../.././init-firebase.js";
//import { Link } from "react-router-dom";

class AddDefense extends React.Component {
  state = {
    userQuery: ""
  };
  render() {
    return (
      <form
        className="formforum"
        style={
          this.props.auth !== undefined &&
          (this.props.community.authorId === this.props.auth.uid ||
            (this.props.community.admin &&
              this.props.community.admin.includes(this.props.auth.uid)) ||
            this.props.x.authorId === this.props.auth.uid ||
            (this.props.x.admin &&
              this.props.x.admin.includes(this.props.auth.uid)) ||
            (this.props.x.defense &&
              this.props.x.defense.includes(this.props.auth.uid)) ||
            (this.props.x.judges &&
              this.props.x.judges.includes(this.props.auth.uid)))
            ? {
                display: "grid",
                position: "relative",
                height: "min-content",
                flexDirection: "column",
                alignItems: "center",
                breakInside: "avoid",
                width: `calc(100vw / ${this.props.columncount})`,
                color: "rgb(220,220,250)"
              }
            : {
                display: "none"
              }
        }
      >
        <div
          onClick={
            this.state.showDefense
              ? () => this.setState({ showDefense: false })
              : () => this.setState({ showDefense: true })
          }
          style={{ padding: "10px", color: "white", textDecoration: "none" }}
        >
          <div
            style={{
              color: "none",
              position: "absolute",
              transform: "rotate(180deg) translate(-90px,3px)",
              WebkitTextStroke: "1px white",
              WebkitTextFillColor: "#844fff"
            }}
          >
            ^
          </div>
          {this.state.showDefense ? "Requests" : "Defense"}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ color: "rgb(190,170,250)", fontSize: "14px" }}>
            {!this.state.showDefense ? "Requests" : "Defense"}
          </div>
          <div
            style={{
              color: "rgb(190,190,220)",
              fontSize: "12px",
              textDecoration: "none"
            }}
          >
            admins control
          </div>
        </div>
        <input
          onChange={(e) =>
            this.setState({ userQuery: e.target.value.toLowerCase() })
          }
          value={this.state.userQuery}
          placeholder="New member"
        />
        <div
          style={
            this.props.x.defense && this.props.x.defense.length > 4
              ? { overflowX: "hidden", overflowY: "auto", display: "flex" }
              : {}
          }
        >
          <div
            style={{
              flexDirection: "column",
              width: "100%",
              height: "min-content"
            }}
          >
            {this.state.userQuery !== "" &&
              this.props.users &&
              this.props.users.map((x) => {
                if (this.props.x && x.username.includes(this.state.userQuery)) {
                  return (
                    <div
                      key={x.id}
                      style={{
                        display: "flex",
                        padding: "20px",
                        width: "100%",
                        height: "min-content",
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                      onClick={() => {
                        if (this.props.x.defense.includes(x.id)) {
                          var answer1 = window.confirm(
                            `remove ${x.name}@${x.username} as defense?`
                          );

                          if (answer1)
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.x.id)
                              .update({
                                defense: firebase.firestore.FieldValue.arrayRemove(
                                  x.id
                                )
                              })
                              .catch((err) => console.log(err.message));
                        } else {
                          var answer = window.confirm(
                            `add ${x.name}@${x.username} as defense?`
                          );

                          if (answer)
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.x.id)
                              .update({
                                defense: firebase.firestore.FieldValue.arrayUnion(
                                  x.id
                                )
                              })
                              .catch((err) => console.log(err.message));
                        }
                      }}
                    >
                      <img
                        style={{ height: "30px", width: "30px" }}
                        src={x.photoThumbnail}
                        alt={x.username}
                      />
                      {x.name}@{x.username}
                      {this.props.x.defense &&
                      this.props.x.defense.includes(x.id) ? (
                        <div
                          style={{
                            marginLeft: "4px",
                            color: "grey",
                            fontSize: "12px",
                            border: "1px solid grey",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            height: "14px",
                            right: "0px",
                            wordBreak: "break-all",
                            paddingRight: "3px"
                          }}
                        >
                          &times;
                        </div>
                      ) : (
                        <div
                          style={{
                            marginLeft: "4px",
                            color: "grey",
                            fontSize: "12px",
                            border: "1px solid grey",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            height: "14px",
                            right: "0px",
                            wordBreak: "break-all",
                            paddingRight: "3px"
                          }}
                        >
                          +
                        </div>
                      )}
                    </div>
                  );
                } else return null;
              })}
            {this.state.userQuery === "" && this.state.showDefense
              ? this.props.x &&
                this.props.x.requestingDefense.map((x) => {
                  var user = this.props.users.find((y) => y.id === x);
                  //if (this.props.auth.uid !== user.id) {
                  return (
                    <div
                      key={x}
                      style={{
                        display: "flex",
                        padding: "10px 20px",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <img
                        style={{ height: "30px", width: "30px" }}
                        src={user.photoThumbnail}
                        alt={user.username}
                      />
                      {user.name}@{user.username}
                      <div>
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              `accept ${x.name}@${x.username} as defense?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection(this.props.collection)
                                .doc(x.id)
                                .update({
                                  requestingDefense: firebase.firestore.FieldValue.arrayRemove(
                                    x
                                  ),
                                  defense: firebase.firestore.FieldValue.arrayUnion(
                                    x
                                  )
                                })
                                .catch((err) => console.log(err.message));
                          }}
                        >
                          Accept
                        </div>
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              `reject ${x.name}@${x.username} as defense?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection(this.props.collection)
                                .doc(x.id)
                                .update({
                                  requestingDefense: firebase.firestore.FieldValue.arrayRemove(
                                    x
                                  )
                                })
                                .catch((err) => console.log(err.message));
                          }}
                        >
                          Reject
                        </div>
                      </div>
                    </div>
                  );
                  //} else return null;
                })
              : null}
          </div>
        </div>
      </form>
    );
  }
}
export default AddDefense;
