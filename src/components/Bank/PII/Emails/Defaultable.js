import React from "react";
import firebase from "../../../.././init-firebase";

class Defaultable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      newEmail: this.props.user.email ? this.props.user.email : ""
    };
  }
  componentWillUnmount = () => {
    clearInterval(this.int);
  };
  pauser = () => {
    this.setState({ pause: true });
    this.int = setInterval(
      () => this.setState({ timer: this.state.timer + 1 }),
      1000
    );
    setTimeout(() => {
      clearInterval(this.int);
      this.setState({ pause: false, timer: 0 });
    }, 10000);
  };
  unlinkPayoutAndDelete = async () => {
    const account = await this.stripe.payouts.create({
      id: "po_1HnrSaH0kRElZnOzCEyXENRs",
      object: "payout",
      amount: 1100,
      arrival_date: 1605484800,
      automatic: true,
      balance_transaction: "txn_1HnrSZ2eZvKYlo2CqQ0ajog5",
      created: 1605470668,
      currency: "usd",
      description: "STRIPE PAYOUT",
      destination: "ba_1HnrSaH0kRElZnOzly9fiE4o",
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      livemode: false,
      metadata: {},
      method: "standard",
      original_payout: null,
      reversed_by: null,
      source_type: "card",
      statement_descriptor: null,
      status: "in_transit",
      type: "bank_account"
    });
    if (account) this.finishDelete("successful payout");
  };
  withBalance = (currentUser, email) => {
    if (this.stripe.user.defaultBank) {
      var answer = window.confirm(
        `are you sure you want to withdrawal ${this.stripe.user.balance}` +
          ` to ${this.stripe.user.defaultBank},` +
          ` delete your account, and delete your email?  You'll be logged out`
      );
      if (answer) {
        this.unlinkPayoutAndDelete(currentUser, email);
      }
    } else
      return window.alert(
        `you have ${this.stripe.user.balance} in your account, and no default bank. ` +
          `You must register a default bank to payout - then you may delete ` +
          `your account with us when your balance is 0`
      );
  };
  finishDelete = async (currentUser, email) => {
    var answer = window.confirm(
      `continue with ${
        this.props.user.banked ? "bank" : "email"
      } account deletion?`
    );
    if (answer) {
      var body = JSON.stringify({
        userId: currentUser.uid,
        email,
        phone: currentUser.phoneNumber
      });
      var url = `https://us-central1-thumbprint-1c31n.cloudfunctions.net/deleteUserEmail`;
      await fetch(url, {
        method: "POST",
        //credentials: "include",
        headers: {
          "Content-Type": "Application/JSON",
          "Access-Control-Request-Method": "POST"
        },
        body,
        maxAge: 3600
        //"mode": "cors",
      })
        .then(async (response) => await response.text())
        .then((body) => {
          window.alert(body);
          firebase
            .firestore()
            .collection("userDatas")
            .doc(this.props.auth.uid)
            .update({
              defaultEmail: null
            })
            .then(() => {
              if (this.props.user.banked) {
                this.props.deleteStripe();
              }
              window.location.reload();
              //this.pauser();
            })
            .catch((err) => console.log(err.message));
        })
        .catch((err) => console.log(err.message));
    }
  };
  deleteLastOne = (user, email) => {
    if (!user.banked) {
      firebase
        .firestore()
        .collection("userDatas")
        .doc(this.props.auth.uid)
        .update({
          defaultEmail: null
        })
        .then(() => {
          var answer = window.confirm(`delete email? you will be logged out`);
          if (answer) {
            this.finishDelete(this.props.auth, email);
          }
          this.pauser();
        })
        .catch((err) => console.log(err.message));
    } else {
      if (this.stripe.user.balance === 0) {
        this.finishDelete(user, email);
      } else {
        this.withBalance(this.props.auth, email);
      }
    }
  };
  deleteOneOfMany = async (email) => {
    var answer = window.confirm(`delete ${email}?`);
    if (answer) {
      var newDefault = this.props.user.confirmedEmails.find((e) => e !== email);
      var update = {};
      update =
        this.props.user.defaultEmail === email
          ? {
              defaultEmail: newDefault,
              confirmedEmails: firebase.firestore.FieldValue.arrayRemove(email)
            }
          : {
              confirmedEmails: firebase.firestore.FieldValue.arrayRemove(email)
            };
      firebase
        .firestore()
        .collection("userDatas")
        .doc(this.props.auth.uid)
        .update(update);
      if (this.props.user.banked) {
      }
    }
  };
  updateStripeEmail = (email) => {
    //edit email in stripe
    /*const account = await this.stripe.accounts.update({
    type: "custom",
    country: "US",
    email: x,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });*/
  };
  render() {
    const { x, i, user } = this.props;
    return (
      <div
        onMouseEnter={() => this.setState({ hoverEmail: true })}
        onMouseLeave={() => this.setState({ hoverEmail: false })}
        style={{ display: "flex" }}
      >
        <div
          key={i}
          style={{
            display: "flex",
            fontSize: "12px",
            color: "grey",
            padding: "3px",
            margin: "1px",
            textDecoration: user.defaultEmail === x ? "underline" : "none"
          }}
          onClick={() => {
            if (this.state.timer === 0) {
              if (user.defaultEmail === x) {
                if (this.props.user.confirmedEmails.length === 1) {
                  this.deleteLastOne(user, null);
                } else {
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update({
                      defaultEmail: null
                    })
                    .catch((err) => console.log(err.message));
                }
              } else {
                console.log("making default");
                firebase
                  .firestore()
                  .collection("userDatas")
                  .doc(this.props.auth.uid)
                  .update({
                    defaultEmail: x
                  })
                  .then(() => {
                    if (user.banked) {
                      this.updateStripeEmail(x);
                    }
                    this.pauser();
                  })
                  .catch((err) => console.log(err.message));
              }
            } else {
              window.alert(`just wait ${this.state.timer} seconds`);
            }
          }}
        >
          {this.state.timer !== 0 && (
            <div>
              <div
                style={{
                  marginRight: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  width: "15px",
                  height: "15px",
                  position: "absolute"
                }}
              >
                {this.state.timer}
              </div>
              <div
                style={{
                  marginRight: "5px",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50px",
                  borderBottom: "1px solid",
                  transform: `rotate(${(this.state.timer / 10) * 360}deg)`,
                  transition: `${this.state.timer / 10}s ease-in`
                }}
              />
            </div>
          )}
          {x}{" "}
        </div>
        {(this.props.user.defaultEmail === x || this.state.hoverEmail) && (
          <div
            onClick={() => {
              if (user.confirmedEmails.length > 1) {
                this.deleteOneOfMany(x);
              } else {
                this.deleteLastOne(user, x);
              }
            }}
            style={{
              textDecoration: "none",
              fontSize: "10px",
              color: "grey",
              border:
                user.defaultEmail === x || this.state.hoverEmail
                  ? "1px solid"
                  : "none",
              padding: "3px",
              margin: "1px",
              borderRadius: "4px"
            }}
          >
            {this.state.hoverEmail
              ? "delete"
              : user.defaultEmail === x
              ? "default"
              : null}
          </div>
        )}
      </div>
    );
  }
}
export default Defaultable;
