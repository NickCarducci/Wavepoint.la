import React from "react";
import Adder from "./Emails/Adder";
import Confirmable from "./Emails/Confirmable";
import Emails from "./Emails";

class Info extends React.Component {
  state = {
    newBirthday: this.props.user.DOB ? this.props.user.DOB : "",
    last4: this.props.user.SSN ? this.props.user.SSN : ""
  };
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid grey",
            borderRadius: "10px",
            padding: "4px"
          }}
          onClick={this.props.editNames}
        >
          {this.props.user.firstName}&nbsp;
          {this.props.user.surname}
        </div>
        {/*!this.state.changePrivate &&
        this.props.user.SSN &&
        this.props.user.DOB ? (
          <div
            onClick={() => {
              var answer = window.confirm(
                "edit your private default-email, ssn or dob?"
              );

              if (answer) {
                this.setState({ changePrivate: true });
              }
            }}
          >
            Locked
            <br />
            <div style={{ fontSize: "12px" }}>["email", "ssn", "dob"]</div>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (this.state.newBirthday !== "" && this.state.last4 !== "") {
                firebase
                  .firestore()
                  .collection("userDatas")
                  .doc(this.props.auth.uid)
                  .update({
                    DOB: this.state.newBirthday,
                    SSN: this.state.last4
                  });

                this.state.changePrivate &&
                  this.setState({ changePrivate: false });
              } else return this.setState({ changePrivate: false });
            }}
          >
            <div>
              <label>dateOfBirth</label>
              <input
                type="date"
                id="dateOfBirth"
                placeholder="Birthday"
                value={this.state.newBirthday}
                onChange={(e) => this.setState({ newBirthday: e.target.value })}
              />
            </div>
            <div>
              <label>last 4 of ssn</label>
              <input
                autoComplete="off"
                type="number"
                id="ssn"
                placeholder="Social security number"
                value={this.state.last4}
                onChange={(e) => this.setState({ last4: e.target.value })}
              />
            </div>
            {this.state.newBirthday !== "" && this.state.last4 !== "" && (
              <button
                type="submit"
                style={{
                  left: "50%",
                  top: "5px",
                  position: "relative",
                  transform: "translateX(-50%)",
                  display: "flex",
                  width: "min-content"
                }}
              >
                Save
              </button>
            )}
          </form>
        )*/}
        <div
          style={{
            marginBottom: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            border: "1px solid grey",
            borderRadius: "10px",
            transition: ".3s ease-out"
          }}
        >
          {this.state.addEmail ? (
            <Adder
              close={() => this.setState({ addEmail: false })}
              user={this.props.user}
              auth={this.props.auth}
            />
          ) : (
            <div
              onClick={() => this.setState({ addEmail: true })}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <div
                onMouseEnter={() => this.setState({ verifyHover: true })}
                onMouseLeave={() => this.setState({ verifyHover: false })}
                style={{
                  width: "100%",
                  borderTopLeftRadius: "9px",
                  display: "flex",
                  fontSize: "12px",
                  color: "grey",
                  padding: "3px",
                  transition: "1s ease-out",
                  backgroundColor: this.state.verifyHover
                    ? "rgb(250,200,200)"
                    : "white"
                }}
              >
                verified emails
              </div>{" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "20px",
                  borderTopRightRadius: "9px",
                  fontSize: "12px",
                  color: "grey",
                  borderLeft: "1px solid",
                  padding: "3px"
                }}
              >
                +
              </div>
            </div>
          )}
          {this.props.user.email && (
            <Confirmable user={this.props.user} auth={this.props.auth} />
          )}
          {this.props.user.confirmedEmails ? (
            <Emails
              user={this.props.user}
              auth={this.props.auth}
              deleteStripe={this.props.deleteStripe}
            />
          ) : (
            <div
              style={{
                fontSize: "12px",
                color: "grey",
                padding: "3px",
                margin: "1px"
              }}
            >
              no verified emails
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Info;
