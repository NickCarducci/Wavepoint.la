import React from "react";
import firebase from "../../.././init-firebase.js";

class Addteach extends React.Component {
  state = {
    users: [],
    userQuery: "",
    receiver: ""
  };
  render() {
    const { columncount } = this.props;
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="formforum"
        style={
          this.props.auth !== undefined &&
          this.props.community &&
          (this.props.community.authorId === this.props.auth.uid ||
            this.props.community.admin.includes(this.props.auth.uid)) &&
          this.props.editingCommunity
            ? {
                backgroundColor: "rgb(120,120,190)",
                color: "rgb(220,220,250)",
                userSelect: this.props.editingSomeText ? "none" : "all",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "100%",
                maxHeight:
                  columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
                height: `max-content`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }
            : {
                display: "none"
              }
        }
      >
        <div
          style={{
            userSelect: this.props.editingCommunity ? "none" : "all",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          <div style={{ padding: "10px" }}>
            Faculty can add classes and departments{" "}
            <div style={{ color: "rgb(190,190,220)", fontSize: "12px" }}>
              admins control
            </div>
          </div>
          <input
            onChange={(e) =>
              this.props.queryText({ userQuery: e.target.value.toLowerCase() })
            }
            value={this.props.userQuery}
            placeholder="New faculty"
          />
          <div
            onClick={() => {
              this.setState({ userQuery: "" });
              this.props.resetUsers();
            }}
          >
            &times;
          </div>
          <div
            style={
              this.props.community.faculty &&
              this.props.community.faculty.length > 4
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
                users &&
                users.map(
                  (x) =>
                    this.props.community &&
                    x.username.includes(this.state.userQuery) && (
                      <div
                        onClick={() => {
                          if (
                            this.props.community.faculty &&
                            this.props.community.faculty.includes(x.id)
                          ) {
                            var answer1 = "";

                            if (this.props.community.admin.includes(x.id)) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as faculty?  They are also an administrator...`
                              );
                            } else if (
                              this.props.community.members.includes(x.id)
                            ) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as faculty? They are also a member`
                              );
                            } else {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as faculty?`
                              );
                            }
                            if (answer1)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  faculty: firebase.firestore.FieldValue.arrayRemove(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      delegateOf: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          } else {
                            var answer = "";

                            if (this.props.community.admin.includes(x.id)) {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as faculty?  They are also an administrator...`
                              );
                            } else if (
                              this.props.community.members.includes(x.id)
                            ) {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as faculty? They are also a member`
                              );
                            } else {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as faculty?`
                              );
                            }
                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  faculty: firebase.firestore.FieldValue.arrayUnion(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      delegateOf: firebase.firestore.FieldValue.arrayUnion(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          }
                        }}
                        key={x.id}
                        style={{
                          display: "flex",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          alignItems: "center"
                        }}
                      >
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={x.photoThumbnail}
                          alt={x.username}
                        />
                        {x.name}@{x.username}&nbsp;
                        {this.props.community.faculty &&
                        this.props.community.faculty.includes(x.id) ? (
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
                    )
                )}

              {this.state.userQuery === "" &&
                this.props.user !== undefined &&
                this.props.community.delegatesProfiled &&
                this.props.community.delegatesProfiled.map((user) => {
                  var allClasses = firebase
                    .firestore()
                    .collection("classes")
                    .where("authorId", "==", user.id)
                    .onSnapshot((querySnapshot) => {
                      let ho = [];
                      querySnapshot.docs.forEach(
                        (doc) => doc.exists && ho.push(doc)
                      );
                      return ho;
                    });
                  var allDepts = firebase
                    .firestore()
                    .collection("classes")
                    .where("authorId", "==", user.id)
                    .onSnapshot((querySnapshot) => {
                      let ho = [];
                      querySnapshot.docs.forEach(
                        (doc) => doc.exists && ho.push(doc)
                      );
                      return ho;
                    });
                  return (
                    <div
                      key={x}
                      style={{
                        display: "flex",
                        margin: "5px 0px",
                        padding: "0px 5px",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      {user.username}
                      <div
                        style={{
                          flexDirection: "column",
                          marginRight: "20px",
                          display: "flex"
                        }}
                      >
                        <div>c{allClasses.length}</div>
                        <div>d{allDepts.length}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default Addteach;
