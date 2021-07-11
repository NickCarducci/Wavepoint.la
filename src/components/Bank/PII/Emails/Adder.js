import React from "react";
import firebase from "../../../.././init-firebase";

class Adder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: this.props.user.email ? this.props.user.email : ""
    };
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider(
      firebase.auth()
    );
    this.recaptcha = React.createRef();
  }
  handleUpdateEmail = (user) => {
    user
      .updateEmail(this.state.newEmail)
      .then(() => {
        // Update successful.
        console.log("email updated to " + this.state.newEmail);
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
                      email: this.state.newEmail
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${this.state.newEmail}` +
                          ` in order to add bank accounts`
                      )
                    )
                    .catch((err) => console.log(err.message));
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .set({
                      email: this.state.newEmail
                    })
                    .then(() =>
                      window.alert(
                        `great, please click the link in the email` +
                          ` from Google sent to ${this.state.newEmail}` +
                          ` in order to add bank accounts`
                      )
                    )
                    .catch((err) => console.log(err.message));
                }
              });
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => {
        console.log(err.code);
        console.log(err.message);
        if (err.code === "auth/requires-recent-login") this.handleReauth(user);
        // An error happened.
      });
  };
  handleReauth = (user) => {
    console.log("reauthenticating...");
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
        this.handleUpdateEmail(this.props.auth);
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
      }. Resend verification email to ${this.state.newEmail}?`
    );
    if (answer) {
      this.handleUpdateEmail(this.props.auth);
    } else {
      console.log(
        err
          ? err.message
          : `you'll need to use the emailed link to verify ${this.state.newEmail}`
      );
    }
  };
  render() {
    return (
      <div style={{ width: "min-content" }}>
        <form
          style={{ width: "100%", display: "flex" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (
              this.state.newEmail !== "" &&
              this.state.newEmail.split("@")[1].split(".")[1]
            ) {
              if (
                !this.props.user.confirmedEmails ||
                !this.props.user.confirmedEmails.includes(this.state.newEmail)
              ) {
                if (this.props.user.email !== this.state.newEmail) {
                  // Construct the email link credential from the current URL.
                  /*var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
                  this.state.newEmail,
                  window.location.href
                );*/
                  this.handleError();
                } else
                  return window.alert(
                    `email ${this.state.newEmail} already added, please confirm`
                  );
              } else
                return window.alert(
                  `email ${this.state.newEmail} already added`
                );
            } else
              return window.alert(
                `${this.state.newEmail} is not an email format`
              );
          }}
        >
          <label
            onClick={this.props.close}
            onMouseEnter={() => this.setState({ hoverClose: true })}
            onMouseLeave={() => this.setState({ hoverClose: false })}
            style={{
              borderTopLeftRadius: "9px",
              fontSize: "12px",
              color: "grey",
              padding: "3px",
              transition: !this.state.hoverClose
                ? ".2s ease-out"
                : "1s ease-out",
              backgroundColor: this.state.hoverClose
                ? "rgb(250,200,200)"
                : "white"
            }}
          >
            {this.state.hoverClose ? "close" : "email"}
          </label>
          <input
            className="input"
            autoComplete="off"
            id="email"
            placeholder="Email"
            value={this.state.newEmail}
            onChange={(e) => this.setState({ newEmail: e.target.value })}
            style={{
              fontSize: "14px",
              borderTopRightRadius: "9px",
              border: "none",
              borderLeft: "1px solid",
              width: "min-content",
              display: "flex"
            }}
          />
          {this.state.newEmail &&
            this.state.newEmail !== "" &&
            this.state.newEmail.split("@")[1] &&
            this.state.newEmail.split("@")[1].split(".")[1] && (
              <button
                style={{
                  border: "none",
                  borderLeft: "1px solid",
                  borderTopRightRadius: "9px",
                  fontSize: "12px",
                  color: "grey",
                  padding: "3px",
                  margin: "1px"
                }}
                type="submit"
              >
                Save
              </button>
            )}
        </form>
        <div
          style={{ display: this.state.showCaptcha ? "flex" : "none" }}
          ref={this.recaptcha}
        />
      </div>
    );
  }
}
export default Adder;
