import React from "react";
import firebase from "../../.././init-firebase";

class Banking extends React.Component {
  state = {};
  addStripe = async () => {
    if (this.props.user.banked) {
      //add bank
      this.addBank();
    } else {
      const account = await this.props.stripe.accounts.retrieve(
        `acct_${this.props.auth.uid}`
      );
      if (!account || account.deleted) {
        const account = await this.props.stripe.accounts.create({
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
  finishPlaid = async () => {
    await fetch(
      url,
      JSON.stringify({ clientUserId: `acct_${this.props.auth.uid}` })
    )
      .then(async (res) => await res.json())
      .then((res) => {
        var bankToken = {
          stripe_bank_account_token: res.stripe_bank_account_token,
          request_id: res.request_id
        };
        firebase
          .firestore()
          .collection("banks")
          .doc(bankToken.stripe_bank_account_token)
          .set({
            owner: this.props.auth.uid,
            name: this.state.nickName
          })
          .then(async (docRef) => {
            console.log(`creating source with ${docRef.id}`);
            const source = await this.props.stripe.customers.createSource(
              `bk_${bankToken.stripe_bank_account_token}`,
              {
                default_source: bankToken.stripe_bank_account_token
              }
            );
          });
      })
      .catch((err) => console.log(err.message));
  };
  addBank = async () => {
    await fetch(
      url,
      JSON.stringify({ clientUserId: `acct_${this.props.auth.uid}` })
    )
      .then(async (res) => await res.json())
      .then((res) => {
        const configs = {
          // Pass the link_token generated in step 2.
          token: res.LINK_TOKEN,
          onLoad: () => {
            // The Link module finished loading.
          },
          onSuccess: (public_token, metadata) => {
            this.finishPlaid(public_token);
            // The onSuccess function is called when the user has
            // successfully authenticated and selected an account to
            // use.
            //
            // When called, you will send the public_token
            // and the selected account ID, metadata.accounts,
            // to your backend app server.
            //
            // sendDataToBackendServer({
            //   public_token: public_token,
            //   account_id: metadata.accounts[0].id
            // });
            console.log("Public Token: " + public_token);
            switch (metadata.accounts.length) {
              case 0:
                // Select Account is disabled: https://dashboard.plaid.com/link/account-select
                break;
              case 1:
                console.log(
                  "Customer-selected account ID: " + metadata.accounts[0].id
                );
                break;
              default:
              // Multiple Accounts is enabled: https://dashboard.plaid.com/link/account-select
            }
          },
          onExit: async function (err, metadata) {
            // The user exited the Link flow.
            if (err != null) {
              // The user encountered a Plaid API error
              // prior to exiting.
            }
            // metadata contains information about the institution
            // that the user selected and the most recent
            // API request IDs.
            // Storing this information can be helpful for support.
          }
        };

        var linkHandler = Plaid.create(configs);

        linkHandler.open();
      })
      .catch((err) => console.log(err.message));
  };
  render() {
    const { stripe } = this.props;
    if (this.props.user.banks && this.props.user.banks.length > 0) {
      return this.props.user.banks.map((x) => {
        return (
          <div>
            <div
              onClick={async () => {
                const source = await stripe.customers.deleteSource(
                  `cus_${this.props.auth.uid}`
                );
                window.alert(`${source.id} detached, cannot be used`);
              }}
            ></div>
            <div
              onClick={async () => {
                var answerAmount = window.prompt(
                  `how much do you want to deposit to ${x.name}`
                );
                const payout = await stripe.payouts.create({
                  amount: answerAmount,
                  currency: this.props.user.currency
                });
              }}
            >
              deposit
            </div>
            <div>&#8678;</div>
            <div>{x.name}</div>
          </div>
        );
      });
    } else {
      return (
        <div style={{ display: "flex" }}>
          {this.props.user.banked ? (
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
              onClick={this.addStripe}
              style={{
                color: "grey",
                marginTop: "10px",
                marginRight: "10px",
                padding: "10px",
                border: "3px solid grey"
              }}
            >
              ready to bank
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
}
export default Banking;
