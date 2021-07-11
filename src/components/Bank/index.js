import React from "react";
import Stripe from "stripe";
import Profiler from "../../widgets/Profiler";
import Account from "./Account";
import User from "./User";
import firebase from "../.././init-firebase";

class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currencies: [], usersWithStripe: [] };
    this.stripe = new Stripe(this.props.stripeKey);
  }
  componentDidMount = () => {
    /*
     const balance = await stripe.balance.retrieve({
  stripeAccount: '{{CONNECTED_STRIPE_ACCOUNT_ID}}'
});
     */
    firebase
      .firestore()
      .collection("users")
      .where("following", "array-contains", this.props.auth.uid)
      .orderBy("banked")
      .limit(10)
      .onSnapshot((querySnapshot) => {
        let usersWithStripe = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            usersWithStripe.push(foo);
          }
        });
        if (
          querySnapshot.docs.length === p &&
          this.state.usersWithStripe !== usersWithStripe
        ) {
          this.setState({ usersWithStripe });
        }
      });
  };
  render() {
    const { forSuggestion } = this.props;
    const { usersWithStripe } = this.state;
    return (
      <div
        style={
          this.props.bankingOpen
            ? {
                display: "flex",
                position: "relative",
                flexDirection: "column",
                height: "min-content",
                transition: "height .3s ease-in"
              }
            : {
                display: "flex",
                position: "relative",
                flexDirection: "column",
                height: "0px",
                transition: "height .3s ease-out"
              }
        }
      >
        <div
          style={
            this.props.bankingOpen
              ? {
                  display: "flex",
                  position: "relative",
                  opacity: "1",
                  flexDirection: "column",
                  transition: "opacity .3s ease-in"
                }
              : {
                  display: "flex",
                  opacity: "0",
                  position: "relative",
                  flexDirection: "column",
                  transition: "opacity 0s ease-out"
                }
          }
        >
          <div
            style={{
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
              marginTop: "70px"
            }}
          >
            <Account
              stripe={this.stripe}
              forSuggestion={forSuggestion}
              user={this.props.user}
              auth={this.props.auth}
              currentUser={this.props.currentUser}
            />
            {/**
             * user search:
             * 1) transfer to
             * 2) a. transaction history (filter by entity)
             * b. transfer history (filter by source)
             */}
            {usersWithStripe.map((user) => {
              return (
                <div
                  style={{
                    borderRadius: "15px",
                    padding: "5px",
                    border:
                      this.state.openedProfile === user.id
                        ? "3px solid blue"
                        : "0px solid none",
                    transition: ".3s ease-in"
                  }}
                >
                  <div
                    onClick={
                      this.state.openedProfile
                        ? () => this.setState({ openedProfile: false })
                        : () => this.setState({ openedProfile: user.id })
                    }
                  >
                    <Profiler
                      user={this.props.user}
                      x={user}
                      auth={this.props.auth}
                    />
                  </div>
                  <User
                    stripe={this.stripe}
                    x={user}
                    user={this.props.user}
                    openedProfile={this.state.openedProfile}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default Bank;
