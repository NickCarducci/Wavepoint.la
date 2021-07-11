import React from "react";
import firebase from "../../../.././init-firebase";

class Confirmable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider(
      firebase.auth()
    );
    this.recaptcha = React.createRef();
  }
  handleUpdateEmail = (user) => {
    console.log(user);
    user
      .updateEmail(this.props.user.email)
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
                      email: this.props.user.email
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${this.props.user.email}` +
                          ` in order to add bank accounts`
                      )
                    );
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .set({
                      email: this.props.user.email
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${this.props.user.email}` +
                          ` in order to add bank accounts`
                      )
                    );
                }
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/requires-recent-login") this.handleReauth(user);
        // An error happened.
      });
  };
  handleReauth = (user) => {
    this.setState({ showCaptcha: true });
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
  handleError = (err) => {
    var answer = window.confirm(
      `${
        err
          ? err.message
          : `you'll need to use the special emailed link to verify your email`
      }. Resend verification email to ${this.props.user.email}?`
    );
    if (answer) {
      this.handleUpdateEmail(this.props.auth);
    } else {
      console.log(
        err
          ? err.message
          : `you'll need to use the emailed link to verify ${this.props.user.email}`
      );
    }
  };
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid grey",
            borderRadius: "10px",
            padding: "0px 4px",
            margin: "4px",
            transition: ".3s ease-out"
          }}
        >
          <div
            onClick={() => {
              var url = window.location.href;
              if (url.includes("&mode=") && url.includes("&oobCode=")) {
                var mode = url.split("&mode=")[1].split("&")[0];
                var actionCode = url.split("&oobCode=")[1].split("&")[0];
                if (mode === "verifyEmail")
                  firebase
                    .auth()
                    .applyActionCode(actionCode)
                    .then(() => {
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({
                          email: null,
                          confirmedEmails: firebase.firestore.FieldValue.arrayUnion(
                            this.props.user.email
                          )
                        });
                      window.alert(
                        "nice! email confirmed.. now you can add banks"
                      );
                      console.log(
                        "nice! email confirmed.. now you can add banks"
                      );
                    })
                    .catch((err) => {
                      if (err.message === "Invalid email link!") {
                        this.handleError(err);
                      }
                    });
              } else return this.handleError();
            }}
          >
            confirm {this.props.user.email}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid grey",
              borderRadius: "10px",
              padding: "0px 4px",
              margin: "4px"
            }}
            onClick={() => {
              var answer = window.confirm(
                `remove ${this.props.user.email} from confirmed email candidacy`
              );
              if (answer) {
                firebase
                  .firestore()
                  .collection("userDatas")
                  .doc(this.props.auth.uid)
                  .update({
                    email: null
                  });
              }
            }}
          >
            &times;
          </div>
        </div>
        <div
          style={{ display: this.state.showCaptcha ? "flex" : "none" }}
          ref={this.recaptcha}
        />
      </div>
    );
  }
}
export default Confirmable;
