import React from "react";
import firebase from "../../.././init-firebase";

class Names extends React.Component {
  state = {
    newSurname: this.props.user.surname ? this.props.user.surname : "",
    newName: this.props.user.firstName ? this.props.user.firstName : ""
  };
  render() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.state.newName !== "" && this.state.newSurname !== "") {
            if (
              this.props.user.firstName !== this.state.newName ||
              this.props.user.surname !== this.state.newSurname
            ) {
              var answer = window.confirm(
                `update name to ${this.state.newName} ${this.state.newSurname}?`
              );
              if (answer) {
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
                          surname: this.state.newSurname,
                          firstName: this.state.newName
                        })
                        .then(() => this.props.closeNames())
                        .catch((err) => console.log(err));
                    } else {
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .set({
                          surname: this.state.newSurname,
                          firstName: this.state.newName
                        })
                        .then(() => this.props.closeNames())
                        .catch((err) => console.log(err));
                    }
                  })
                  .catch((err) => console.log(err));
              }
            } else return this.props.closeNames();
          }
        }}
      >
        <div>
          <label style={{ fontSize: "12px", color: "grey", margin: "5px" }}>
            firstName
          </label>
          <input
            className="input"
            autoComplete="off"
            minLength="2"
            type="text"
            id="firstName"
            placeholder="Name"
            value={this.state.newName}
            onChange={(e) => this.setState({ newName: e.target.value })}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "12px", color: "grey", margin: "5px" }}>
            lastName
          </label>
          <input
            className="input"
            autoComplete="off"
            minLength="2"
            type="text"
            id="lastName"
            placeholder="Surname"
            value={this.state.newSurname}
            onChange={(e) => this.setState({ newSurname: e.target.value })}
            style={{ fontSize: "14px" }}
          />
        </div>
        {this.state.newName !== "" && this.state.newSurname !== "" && (
          <button type="submit">Save</button>
        )}
      </form>
    );
  }
}
export default Names;
