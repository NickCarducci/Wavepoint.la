import React from "react";
import Banking from "./Banking";
import Foreign from "./Foreign";
import Ready from "./lock/Ready";
import firebase from "../../.././init-firebase";

class Index extends React.Component {
  state = {};
  deleteStripe = () => {
    /*const account = await this.stripe.customers.delete(
                  this.stripe.user.id
                );*/
    firebase.firestore().collection("users").doc(this.props.auth.uid).update({
      banked: false
    });
  };

  addPaymentIntent = async () => {
    firebase
      .firestore()
      .collection("cards")
      .add({
        owner: this.props.auth.uid,
        name: this.state.nickName
      })
      .then(async (docRef) => {
        const method = await this.props.stripe.paymentMethods.attach(
          `pm_${docRef.id}`,
          {
            customer: `cus_${this.props.auth.uid}`,
            on_behalf_of: `acc_${this.props.auth.uid}`
          }
        );
        if (method) {
          /**
           * payment_method_types:
           * alipay, au_becs_debit, bancontact, card, card_present,
           * eps, giropay, ideal, interac_present, p24, sepa_debit, and sofort
           */
          const saved = await this.props.stripe.setupIntents.create({
            payment_method: `pm_${docRef.id}`,
            customer: `cus_${this.props.auth.uid}`,
            on_behalf_of: `acc_${this.props.auth.uid}`,
            usage: "on_session",
            payment_method_types: ["card"]
          });
        }
      })
      .catch((err) => console.log(err.message));
  };
  render() {
    const { user, stripe } = this.props;
    var us = user.currency === "USD" && user.country === "US";
    return (
      <div
        style={{
          width: "min-content",
          paddingBottom: "10px",
          paddingLeft: "10px",
          borderBottom: "3px solid",
          borderLeft: "3px solid",
          height: user.finishBank ? "min-content" : "0px",
          flexDirection: "column",
          display: "flex",
          alignItems: "flex-end",
          top: "-50px",
          opacity: user.finishBank ? "1" : "0",
          zIndex: user.finishBank ? "1" : "-1",
          position: "relative"
        }}
      >
        <Ready user={user} auth={this.props.auth} />
        {user.finishBank && us ? (
          <Banking
            user={user}
            deleteStripe={this.deleteStripe}
            stripe={stripe}
          />
        ) : (
          user.finishBank && (
            <Foreign
              user={user}
              deleteStripe={this.deleteStripe}
              stripe={stripe}
            />
          )
        )}
      </div>
    );
  }
}
export default Index;
