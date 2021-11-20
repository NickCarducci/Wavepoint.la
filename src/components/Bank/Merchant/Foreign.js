import React from "react";
import firebase from "../../.././init-firebase";

class Foreign extends React.Component {
  addStripe = async () => {
    if (this.props.user.banked) {
      //add paymentIntent
      this.addPaymentIntent();
    } else {
      const account = await this.props.stripe.accounts.retrieve(
        `acct_${this.props.auth.uid}`
      );
      if (!account || account.deleted) {
        const account = await this.stripe.accounts.create({
          type: "custom",
          country: "US",
          email: this.props.user.defaultEmail,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true }
          }
        });
      }

      const customer = await this.props.stripe.customers.retrieve(
        `cus_${this.props.auth.uid}`
      );
      if (customer && !customer.deleted) {
        firebase
          .firestore()
          .collection("users")
          .doc(this.props.auth.uid)
          .update({
            banked: true
          });
      } else {
        const customer = await this.props.stripe.customers.create({
          id: `cus_${this.props.auth.uid}`,
          object: "customer",
          address: {
            line1: this.props.user.address1,
            city: this.props.user.city,
            country: this.props.user.country,
            line2: this.props.user.address2,
            postal_code: this.props.user.ZIP,
            state: this.props.user.state
          },
          balance: 0,
          created: new Date(),
          currency: this.props.user.currency,
          default_source: null,
          delinquent: false,
          description: "My First Test Customer (created for API docs)",
          discount: null,
          email: this.props.user.defaultEmail,
          invoice_prefix: "FDE1D7C",
          invoice_settings: {
            custom_fields: null,
            default_payment_method: null,
            footer: null
          },
          livemode: false,
          metadata: {},
          name: `${this.props.user.firstName} ${this.props.user.surname}`,
          next_invoice_sequence: 1,
          phone: null, //this.props.auth.phone,
          preferred_locales: [],
          shipping: null,
          tax_exempt: "none"
        });
        if (customer) {
          firebase
            .firestore()
            .collection("users")
            .doc(this.props.auth.uid)
            .update({
              banked: true
            });
        }
      }
    }
  };
  addPaymentIntent = () => {};
  render() {
    const { user } = this.props;
    return (
      <div style={{ display: "flex" }}>
        {user.banked ? (
          <div
            onClick={this.props.deleteStripe}
            className="fas fa-trash"
            style={{
              color: "grey",
              marginTop: "10px",
              marginRight: "10px",
              padding: "10px",
              border: "3px solid grey"
            }}
          />
        ) : (
          <div
            onClick={() => {
              window.alert(
                `${user.country} residents ` +
                  `must use cards via stripe (immediate but +.3% higher fee), but we can ` +
                  `already accept your currency ${user.currency}`
              );
              var answer = window.confirm("add card?");
              if (answer) {
                this.addStripe();
              }
            }}
          >
            {user.country}
          </div>
        )}
        <b
          onClick={this.addStripe}
          style={{
            backgroundColor: this.props.user.banked ? "#bc47ff" : "",
            color: "grey",
            marginTop: "10px",
            padding: "10px",
            border: "3px solid grey"
          }}
        >
          +
        </b>
      </div>
    );
  }
}
export default Foreign;
