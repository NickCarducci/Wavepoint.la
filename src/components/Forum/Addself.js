import React from "react";
import firebase from "../.././init-firebase.js";

class Addself extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmailLogin: ""
    };
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider(
      firebase.auth()
    );
    this.recaptcha = React.createRef();
  }
  handleUpdateEmail = (user, email) => {
    user
      .updateEmail(email)
      .then(() => {
        // Update successful.
        user
          .sendEmailVerification()
          .then(() => {
            firebase
              .firestore()
              .collection("userDatas")
              .doc(this.props.auth.uid)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      email
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${email}` +
                          ` in order to join ${this.props.community.message}`
                      )
                    );
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .set({
                      email
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${email}` +
                          ` in order to join ${this.props.community.message}`
                      )
                    );
                }
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/requires-recent-login")
          this.handleReauth(user, email);
        // An error happened.
      });
  };
  handleReauth = (user, email) => {
    var recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      this.recaptcha.current,
      {
        size: "normal",
        callback: (response) => {
          this.setState({ showCaptcha: false });
          console.log(
            String(response) + " reCAPTCHA solved, allow verifyPhoneNumber."
          );
        },
        "expired-callback": (err) => {
          this.setState({ showCaptcha: true });
          console.log(
            String(err) + " Response expired. solve reCAPTCHA again."
          );
        }
      }
    );
    console.log(recaptchaVerifier);
    this.phoneAuthProvider
      .verifyPhoneNumber(this.props.auth.phoneNumber, recaptchaVerifier)
      .then((verificationId) => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          window.prompt("Enter your code")
        );
        return user.reauthenticateWithCredential(credential);
      })
      .then((userCredential) => {
        this.handleUpdateEmail(user);
        // User successfully reauthenticated.
      })
      .catch((err) => console.log(err.message));
  };
  handleError = (err, email) => {
    var answer = window.confirm(
      `${
        err
          ? err.message
          : `you'll need to use the special emailed link to verify your email`
      }. Resend verification email to ${email}?`
    );
    if (answer) {
      var user = firebase.auth().currentUser;
      this.handleUpdateEmail(user, email);
    } else {
      console.log(
        err
          ? err.message
          : `you'll need to use the emailed link to verify ${email}`
      );
    }
  };
  render() {
    return (
      <div
        //to={this.props.auth === undefined ? "/login" : "/"}
        onClick={() =>
          this.props.auth === undefined && this.props.getUserInfo()
        }
        style={
          this.props.auth !== undefined &&
          this.props.community.requestingMembership &&
          this.props.community.requestingMembership.includes(
            this.props.auth.uid
          )
            ? {
                flexDirection: "column",
                display: "flex",
                width: "calc(100%)",
                backgroundColor: "navy",
                color: "white",
                textIndent: "5px",
                breakInside: "avoid",
                alignItems: "flex-start",
                transition: "1s ease-in"
              }
            : {
                flexDirection: "column",
                display: "flex",
                width: "calc(100%)",
                backgroundColor: "rgb(100,150,220)",
                color: "white",
                textIndent: "5px",
                breakInside: "avoid",
                alignItems: "flex-start",
                transition: "1s ease-out",
                textDecoration: "none"
              }
        }
      >
        {this.props.auth === undefined
          ? null
          : (!this.props.community.members ||
              !this.props.community.members.includes(this.props.auth.uid)) && (
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  onChange={(e) => {
                    this.setState({
                      newEmailLogin: e.target.value
                    });
                  }}
                  value={this.state.newEmailLogin}
                  className="input"
                  placeholder="email"
                  style={{
                    width: "70%",
                    padding: "10px",
                    fontSize: "16px",
                    display: "flex",
                    position: "relative",
                    margin: "10px",
                    marginBottom: this.props.community.allowedDomains
                      ? "10px"
                      : "0px",
                    breakInside: "avoid",
                    alignItems: "center",
                    color: "grey",
                    border: "2px solid",
                    borderRadius: "5px",
                    zIndex: "9998"
                  }}
                />
                {this.props.community.allowedDomains &&
                  this.props.user !== undefined &&
                  this.props.community.allowedDomains.map((x) => {
                    var theseemails =
                      this.props.user.confirmedEmails &&
                      this.props.user.confirmedEmails.filter((y) =>
                        y.includes(x)
                      );
                    return (
                      <div
                        style={{
                          height: "56px",
                          minHeight: "min-content",
                          flexDirection: "column",
                          display: "flex",
                          width: "calc(100%)",
                          backgroundColor: "navy",
                          color: "white",
                          textIndent: "5px",
                          breakInside: "avoid",
                          justifyContent: "center",
                          transition: "1s ease-in"
                        }}
                      >
                        {!this.state.newEmailLogin &&
                          theseemails &&
                          theseemails.map((d) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "17px"
                                }}
                              >
                                {d.split("@" + x)[0]}
                                <div
                                  style={{
                                    marginLeft: "4px",
                                    color: "rgb(70,140,100)",
                                    fontSize: "12px",
                                    border: "1px solid",
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
                                  onClick={() => {
                                    firebase
                                      .firestore()
                                      .collection("communities")
                                      .doc(this.props.community.id)
                                      .update({
                                        members: firebase.firestore.FieldValue.arrayUnion(
                                          this.props.auth.uid
                                        )
                                      });
                                    window.alert(
                                      `nice! email confirmed.. now you're a member of ${this.props.community.message}`
                                    );
                                    console.log(
                                      `nice! email confirmed.. now you're a member of ${this.props.community.message}`
                                    );
                                  }}
                                >
                                  join
                                </div>
                                <div
                                  style={{
                                    display: this.state.showCaptcha
                                      ? "flex"
                                      : "none"
                                  }}
                                  ref={this.recaptcha}
                                />
                              </div>
                            );
                          })}
                        {this.state.newEmailLogin
                          ? this.state.newEmailLogin
                          : "_______"}
                        @{x}
                        {this.state.newEmailLogin !== "" && (
                          <div
                            onClick={() => {
                              /*if (
                            this.state.newEmailLogin.split("@")[1] &&
                            this.state.newEmailLogin.split(".")[1]
                          ) {*/
                              var email = this.state.newEmailLogin + "@" + x;
                              this.handleError(null, email);
                            }}
                            style={{
                              color: "white",
                              position: "absolute",
                              right: "20px",
                              zIndex: "9999"
                            }}
                          >
                            +
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
        <div
          onClick={
            this.props.auth === undefined
              ? null
              : this.props.community.members &&
                this.props.community.members.includes(this.props.auth.uid)
              ? () => {
                  let answer = false;
                  var weGood = this.props.community.allowedDomains.find(
                    (x) =>
                      this.props.user.confirmedEmails &&
                      this.props.user.confirmedEmails.filter((y) =>
                        y.includes(x)
                      )
                  );
                  if (weGood) {
                    answer = weGood;
                  } else {
                    answer = window.confirm(
                      `you will need to request access again...` +
                        `${
                          this.props.community.privateToMembers
                            ? "this is a private community"
                            : ""
                        }` +
                        ` leave ${this.props.community.message}?`
                    );
                  }
                  if (answer)
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(this.props.community.id)
                      .update({
                        members: firebase.firestore.FieldValue.arrayRemove(
                          this.props.auth.uid
                        )
                      })
                      .catch((err) => console.log(err.message));
                }
              : this.props.community.requestingMembership &&
                this.props.community.requestingMembership.includes(
                  this.props.auth.uid
                )
              ? () =>
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({
                      requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                        this.props.auth.uid
                      )
                    })
                    .catch((err) => console.log(err.message))
              : () =>
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({
                      requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                        this.props.auth.uid
                      )
                    })
                    .catch((err) => console.log(err.message))
          }
          style={{
            height: "56px",
            alignItems: "center",
            display: "flex",
            marginLeft: "3px",
            width: "calc(100% - 20px)",
            justifyContent: "space-between"
          }}
        >
          {this.props.auth === undefined
            ? "sign in to request membership"
            : this.props.community.members &&
              this.props.community.members.includes(this.props.auth.uid)
            ? "Leave community"
            : this.props.community.requestingMembership &&
              this.props.community.requestingMembership.includes(
                this.props.auth.uid
              )
            ? "Recind request for membership"
            : "Request Access"}
        </div>
      </div>
    );
  }
}
export default Addself;
