import React from "react";
import firebase from "../../.././init-firebase.js";

class AddRep extends React.Component {
  state = {
    userQuery: ""
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
            (this.props.community.admin &&
              this.props.community.admin.includes(this.props.auth.uid)) ||
            (this.props.community.reps &&
              this.props.community.reps.includes(this.props.auth.uid))) &&
          this.props.editingCommunity
            ? {
                backgroundColor: "rgb(0,40,0)",
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
          <div
            style={{
              padding: "10px 0px",
              margin: "0px 10px",
              position: "relative",
              color: "rgb(200,240,220)"
            }}
          >
            Add someone to represent an office{" "}
            <div style={{ color: "rgb(170,220,190)", fontSize: "12px" }}>
              admins control
            </div>
          </div>
          <input
            onChange={(e) =>
              this.props.queryText({ userQuery: e.target.value.toLowerCase() })
            }
            value={this.props.userQuery}
            placeholder="New representative"
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
              this.props.community.reps && this.props.community.reps.length > 4
                ? { overflowX: "hidden", overflowY: "auto", display: "flex" }
                : {}
            }
          >
            <div
              style={{
                width: "100%",
                height: "min-content",
                flexDirection: "row"
              }}
            >
              {this.state.userQuery !== "" &&
                this.props.users &&
                this.props.users.map((x) => {
                  if (
                    this.props.community &&
                    x.username.includes(this.state.userQuery)
                  ) {
                    return (
                      <div
                        key={x.id}
                        style={{
                          display: "flex",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          color: "rgb(200,240,220)",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          if (
                            this.props.community.reps &&
                            this.props.community.reps.includes(x.id)
                          ) {
                            var answer = window.confirm(
                              `remove ${x.name}@${x.username} as a representative?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  reps: firebase.firestore.FieldValue.arrayRemove(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      repping: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          } else {
                            var answer1 = window.confirm(
                              `add ${x.name}@${x.username} as a representative?`
                            );

                            if (answer1)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  reps: firebase.firestore.FieldValue.arrayUnion(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      repping: firebase.firestore.FieldValue.arrayUnion(
                                        this.props.community.id
                                      )
                                    });
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
                        {x.name}@{x.username}&nbsp;
                        {this.props.community.reps &&
                        this.props.community.reps.includes(x.id) ? (
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
              {this.state.userQuery === "" &&
                this.props.user !== undefined &&
                this.props.community &&
                this.props.community.reps &&
                Promise.all(
                  this.props.community.reps.map(async (x) => {
                    var user = await this.props.hydrateUser(x);
                    return user && user;
                  })
                ).then((mapped) => {
                  mapped.map((user) => {
                    return (
                      <div
                        key={user.id}
                        style={{
                          display: "flex",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          color: "rgb(200,240,220)",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div
                          style={
                            this.state.receiver !== user.id
                              ? { opacity: ".5" }
                              : {}
                          }
                        >
                          <img
                            style={{ height: "30px", width: "30px" }}
                            src={user.photoThumbnail}
                            alt={user.username}
                          />
                          {user.name}@{user.username}
                        </div>
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              `remove ${user.name}@${user.username} as representative?`
                            );

                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  reps: firebase.firestore.FieldValue.arrayRemove(
                                    user.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(user.id)
                                    .update({
                                      repping: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          }}
                        >
                          {this.props.community.reps.includes(user.id) ? (
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
                      </div>
                    );
                  });
                })}
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default AddRep;
