import React from "react";
import firebase from "../../.././init-firebase.js";
//import { Link } from "react-router-dom";

class Addmembers extends React.Component {
  state = {
    userQuery: ""
  };
  render() {
    const { columncount } = this.props;
    var show =
      this.props.auth !== undefined &&
      (this.props.community.authorId === this.props.auth.uid ||
        (this.props.community.admin &&
          this.props.community.admin.includes(this.props.auth.uid)) ||
        (this.props.community.facultyCanMember &&
          this.props.community.faculty &&
          this.props.community.faculty.includes(this.props.auth.uid)) ||
        (this.props.community.memberMakers &&
          this.props.community.memberMakers.includes(this.props.auth.uid))) &&
      this.props.editingCommunity;
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="formforum"
        style={{
          backgroundColor: "rgb(0,0,40)",

          alignItems: "center",
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
          display: show ? "flex" : "none",
          color: "black",
          flexDirection: "column",
          opacity: "1",
          borderBottom: "1px solid grey",
          overflowX: "hidden",
          overflowY: columncount === 1 ? "hidden" : "auto"
        }}
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
          <div style={{ position: "relative" }}>
            <div
              onClick={() => {
                if (this.state.newAllowedDomain.split(".")[1]) {
                  if (
                    !this.state.newAllowedDomain.includes("gmail.com") &&
                    !this.state.newAllowedDomain.includes("yahoo.com") &&
                    !this.state.newAllowedDomain.includes("aol.com")
                  ) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(this.props.community.id)
                      .update({
                        allowedDomains: firebase.firestore.FieldValue.arrayUnion(
                          this.state.newAllowedDomain
                        )
                      })
                      .then(() => this.setState({ newAllowedDomain: "" }));
                  } else {
                    window.alert("please use emails from a domain you control");
                  }
                } else {
                  window.alert("please enter a domain");
                }
              }}
              style={{
                color: "grey",
                top: "18px",
                display: "flex",
                position: "absolute",
                right: "23px",
                zIndex: "9999"
              }}
            >
              +
            </div>
          </div>
          <input
            onChange={(e) => {
              var value = e.target.value;
              if (!value.includes("@")) {
                this.setState({
                  newAllowedDomain: value
                });
              }
            }}
            value={this.state.newAllowedDomain}
            className="input"
            placeholder="email domain"
            style={
              this.props.editingCommunity
                ? {
                    padding: "10px",
                    fontSize: "16px",
                    display: "flex",
                    position: "relative",
                    margin: "10px",
                    marginBottom: "0px",
                    breakInside: "avoid",
                    alignItems: "center",
                    color: "grey",
                    border: "2px solid",
                    borderRadius: "5px",
                    zIndex: "9998"
                  }
                : {
                    display: "none"
                  }
            }
          />
          <div
            style={
              this.props.community.allowedDomains
                ? {
                    backgroundColor: "blue",

                    padding: "10px",
                    fontSize: "16px",
                    display: "flex",
                    position: "relative",
                    boxShadow: "6px 3px 50px #222",
                    border: "none",
                    margin: "10px",
                    breakInside: "avoid",
                    textIndent: "10px",
                    alignItems: "center",
                    color: "white"
                  }
                : {
                    display: "none"
                  }
            }
          >
            {this.props.community.allowedDomains &&
              this.props.community.allowedDomains.map((x) => {
                return (
                  <div style={{ margin: "10px" }} key={x}>
                    {x}
                    <div
                      onClick={() =>
                        firebase
                          .firestore()
                          .collection("communities")
                          .doc(this.props.community.id)
                          .update({
                            allowedDomains: firebase.firestore.FieldValue.arrayRemove(
                              x
                            )
                          })
                          .then(() => this.setState({ newAllowedDomain: "" }))
                      }
                      style={{
                        color: "grey",
                        top: "18px",
                        display: "flex",
                        position: "absolute",
                        right: "23px",
                        zIndex: "9999"
                      }}
                    >
                      &times;
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            onClick={
              this.state.showMembers
                ? () => this.setState({ showMembers: false })
                : () => this.setState({ showMembers: true })
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                right: "7px",
                color: "white",
                position: "absolute",
                fontSize: "10px"
              }}
            >
              <div
                style={{
                  fontSize: "10px"
                }}
              >
                {this.props.community.privateToMembers ? "members" : "anyone"}{" "}
                can post & make clubs, restaurants,
              </div>
              <div
                style={{
                  fontSize: "10px"
                }}
              >
                housing, services, shops, venues, jobs or events
              </div>
            </div>
            {this.state.showMembers ? "Requests" : "Members"}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div style={{ color: "rgb(190,170,250)", fontSize: "14px" }}>
              {!this.state.showMembers ? "Requests" : "Members"}
            </div>
            <div
              style={{
                color: "rgb(190,190,220)",
                fontSize: "12px",
                textDecoration: "none"
              }}
            >
              admins
              {this.props.community.facultyCanMember
                ? `, memberMakers and faculty`
                : ` and memberMakers`}{" "}
              control
            </div>
          </div>
          <input
            onChange={(e) =>
              this.props.queryText({ userQuery: e.target.value })
            }
            value={this.props.userQuery}
            placeholder="New member"
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
              this.props.community.members &&
              this.props.community.members.length > 4
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
                  if (
                    this.props.community &&
                    x.username.includes(this.state.userQuery)
                  ) {
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
                          if (this.props.community.members.includes(x.id)) {
                            var answer1 = "";

                            if (this.props.community.admin.includes(x.id)) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member?  They are also an administrator`
                              );
                            } else if (
                              this.props.community.faculty.includes(x.id)
                            ) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member? They are also faculty`
                              );
                            } else {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member?`
                              );
                            }
                            if (answer1)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  members: firebase.firestore.FieldValue.arrayRemove(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      memberOf: firebase.firestore.FieldValue.arrayRemove(
                                        this.props.community.id
                                      )
                                    });
                                })
                                .catch((err) => console.log(err.message));
                          } else {
                            var answer = "";

                            if (this.props.community.admin.includes(x.id)) {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as member?  They are also an administrator`
                              );
                            } else if (
                              this.props.community.faculty.includes(x.id)
                            ) {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as member? They are also faculty`
                              );
                            } else {
                              answer = window.confirm(
                                `add ${x.name}@${x.username} as member?`
                              );
                            }
                            if (answer)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  members: firebase.firestore.FieldValue.arrayUnion(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      memberOf: firebase.firestore.FieldValue.arrayUnion(
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
                        {x.name}@{x.username}
                        {this.props.community.members &&
                        this.props.community.members.includes(x.id) ? (
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
              {this.state.userQuery === "" && this.state.showMembers ? (
                this.props.user !== undefined &&
                this.props.community &&
                Promise.all(
                  this.props.community.requestingMembership.map(async (x) => {
                    var user = await this.props.hydrateUser(x);
                    return user && user;
                  })
                ).then((mapped) => {
                  mapped.map((x) => {
                    return (
                      <div
                        key={x.id}
                        style={{
                          display: "flex",
                          padding: "10px 20px",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={x.photoThumbnail}
                          alt={x.username}
                        />
                        {x.name}@{x.username}
                        <div>
                          <div
                            onClick={() => {
                              var answer = "";

                              if (this.props.community.admin.includes(x.id)) {
                                answer = window.confirm(
                                  `accept ${x.name}@${x.username} as member?  They are also an administrator`
                                );
                              } else if (
                                this.props.community.faculty.includes(x.id)
                              ) {
                                answer = window.confirm(
                                  `accept ${x.name}@${x.username} as member? They are also faculty`
                                );
                              } else {
                                answer = window.confirm(
                                  `accept ${x.name}@${x.username} as member?`
                                );
                              }
                              if (answer)
                                firebase
                                  .firestore()
                                  .collection("communities")
                                  .doc(this.props.community.id)
                                  .update({
                                    requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                                      x
                                    ),
                                    members: firebase.firestore.FieldValue.arrayUnion(
                                      x
                                    )
                                  })
                                  .then(() => {
                                    firebase
                                      .firestore()
                                      .collection("users")
                                      .doc(x.id)
                                      .update({
                                        represents: firebase.firestore.FieldValue.arrayUnion(
                                          this.props.community.id
                                        )
                                      });
                                  })
                                  .catch((err) => console.log(err.message));
                            }}
                          >
                            Accept
                          </div>
                          <div
                            onClick={() => {
                              var answer = "";

                              if (this.props.community.admin.includes(x.id)) {
                                answer = window.confirm(
                                  `reject ${x.name}@${x.username}'s request for membership?  They are also an administrator...`
                                );
                              } else if (
                                this.props.community.faculty.includes(x.id)
                              ) {
                                answer = window.confirm(
                                  `reject ${x.name}@${x.username}'s request for membership? They are also faculty`
                                );
                              } else {
                                answer = window.confirm(
                                  `reject ${x.name}@${x.username} as member?`
                                );
                              }
                              if (answer)
                                firebase
                                  .firestore()
                                  .collection("communities")
                                  .doc(this.props.community.id)
                                  .update({
                                    requestingMembership: firebase.firestore.FieldValue.arrayRemove(
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
                  });
                })
              ) : this.props.community.members &&
                this.props.community.members.length > 0 ? (
                Promise.all(
                  this.props.community.members.map(async (x) => {
                    var user = await this.props.hydrateUser(x);
                    return user && user;
                  })
                ).then((mapped) => {
                  mapped.map((x) => {
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
                          if (this.props.community.members.includes(x)) {
                            var answer1 = "";

                            if (this.props.community.admin.includes(x.id)) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member?  They are also an administrator`
                              );
                            } else if (
                              this.props.community.faculty.includes(x.id)
                            ) {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member? They are also faculty`
                              );
                            } else {
                              answer1 = window.confirm(
                                `remove ${x.name}@${x.username} as member?`
                              );
                            }
                            if (answer1)
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.props.community.id)
                                .update({
                                  members: firebase.firestore.FieldValue.arrayRemove(
                                    x.id
                                  )
                                })
                                .then(() => {
                                  firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(x.id)
                                    .update({
                                      memberOf: firebase.firestore.FieldValue.arrayRemove(
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
                        {this.props.community.members.includes(x.id) && (
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
                        )}
                      </div>
                    );
                  });
                })
              ) : (
                <div
                  style={{
                    display: "flex",
                    padding: "20px",
                    width: "100%",
                    height: "min-content",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  No members
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default Addmembers;
