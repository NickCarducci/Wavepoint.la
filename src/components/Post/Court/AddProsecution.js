import React from "react";
import firebase from "../../.././init-firebase.js";
//import { Link } from "react-router-dom";

class AddProsecution extends React.Component {
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
            (this.props.x.prosecution &&
              this.props.x.prosecution.includes(this.props.auth.uid)) ||
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
            this.state.showProsecution
              ? () => this.setState({ showProsecution: false })
              : () => this.setState({ showProsecution: true })
          }
          style={{ padding: "10px", color: "white", textDecoration: "none" }}
        >
          <div
            style={{
              color: "none",
              position: "absolute",
              transform: "rotate(180deg) translate(-125px,3px)",
              WebkitTextStroke: "1px white",
              WebkitTextFillColor: "#844fff"
            }}
          >
            ^
          </div>
          {this.state.showProsecution ? "Requests" : "Prosecution"}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ color: "rgb(190,170,250)", fontSize: "14px" }}>
            {!this.state.showProsecution ? "Requests" : "Prosecution"}
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
          placeholder="New prosecution"
        />
        <div
          style={
            this.props.x.prosecution && this.props.x.prosecution.length > 4
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
                        if (this.props.x.prosecution.includes(x.id)) {
                          var answer1 = window.confirm(
                            `remove ${x.name}@${x.username} as prosecution?`
                          );

                          if (answer1)
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.x.id)
                              .update({
                                prosecution: firebase.firestore.FieldValue.arrayRemove(
                                  x.id
                                )
                              })
                              .catch((err) => console.log(err.message));
                        } else {
                          var answer = window.confirm(
                            `add ${x.name}@${x.username} as prosecution?`
                          );

                          if (answer)
                            firebase
                              .firestore()
                              .collection(this.props.collection)
                              .doc(this.props.x.id)
                              .update({
                                prosecution: firebase.firestore.FieldValue.arrayUnion(
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
                      {this.props.x.prosecution &&
                      this.props.x.prosecution.includes(x.id) ? (
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
            {this.state.userQuery === "" && this.state.showProsecution
              ? this.props.x &&
                this.props.x.requestingProsecution.map((x) => {
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
                              `accept ${x.name}@${x.username} as prosecution?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection(this.props.collection)
                                .doc(x.id)
                                .update({
                                  requestingProsecution: firebase.firestore.FieldValue.arrayRemove(
                                    x
                                  ),
                                  prosecution: firebase.firestore.FieldValue.arrayUnion(
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
                              `reject ${x.name}@${x.username} as prosecution?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection(this.props.collection)
                                .doc(x.id)
                                .update({
                                  requestingProsecution: firebase.firestore.FieldValue.arrayRemove(
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
export default AddProsecution;
