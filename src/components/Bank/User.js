import React from "react";

class User extends React.Component {
  state = {};
  render() {
    const { forSuggestion, x, openedProfile, stripe } = this.props;
    const { selectedMethod, sendAmount, sendCurrency } = this.state;
    var ready = sendCurrency && sendAmount;
    return (
      <div>
        <div
          style={{
            transition: ".3s ease-in",
            display: "flex",
            height: openedProfile ? "min-content" : "0px",
            opacity: openedProfile ? "1" : "0",
            zIndex: openedProfile ? "1" : "-1"
          }}
        >
          <select
            defaultValue={this.props.user.currency}
            onChange={(e) => this.setState({ sendCurrency: e.target.value })}
          >
            {forSuggestion.map((x) => {
              return <option>{x}</option>;
            })}
          </select>
          <input
            type="number"
            onChange={(e) => this.setState({ sendAmount: e.target.value })}
          />
          <div
            style={{
              transition: ".3s ease-in",
              display: "flex",
              height: ready ? "min-content" : "0px",
              opacity: ready ? "1" : "0",
              zIndex: ready ? "1" : "-1"
            }}
            onClick={async () => {
              if (this.state.methods) {
                this.setState({
                  lastMethods: this.state.methods,
                  methods: false
                });
              } else {
                if (this.state.lastMethods) {
                  this.setState({ methods: this.state.lastMethods });
                } else {
                  const methods = await stripe.paymentMethods.list({
                    customer: `cus_${this.props.auth.uid}`,
                    type: "card"
                  });
                  if (methods) this.setState({ methods });
                }
              }
            }}
          >
            {this.state.methods ? "clear" : "send"}
          </div>
        </div>
        <div
          style={{
            transition: ".3s ease-in",
            display: "flex",
            flexDirection: "column",
            height: this.state.methods ? "min-content" : "0px",
            opacity: this.state.methods ? "1" : "0",
            zIndex: this.state.methods ? "1" : "-1"
          }}
        >
          {this.state.methods &&
            this.state.methods.data.map((x) => {
              return (
                <div
                  onClick={
                    selectedMethod
                      ? () => this.setState({ selectedMethod: false })
                      : () => this.setState({ selectedMethod: x.id })
                  }
                >
                  {x[x.type].brand} * {x.last4} / {x.exp_month}.{x.exp_year}
                </div>
              );
            })}
        </div>
        <div
          style={{
            backgroundColor: "blue",
            color: "white",
            transition: ".3s ease-in",
            display: "flex",
            height: selectedMethod ? "min-content" : "0px",
            opacity: selectedMethod ? "1" : "0",
            zIndex: selectedMethod ? "1" : "-1"
          }}
          onClick={async () => {
            const paymentIntent = await stripe.paymentIntents.create({
              amount: this.state.sendAmount,
              currency: this.state.sendCurrency,
              payment_method: `pm_${this.state.selectedMethod}`,
              payment_method_types: ["card"],
              application_fee_amount: 0,
              on_behalf_of: `acc_${this.props.auth.uid}`,
              transfer_data: {
                destination: `acc_${x.id}`
              }
            });
          }}
        >
          pay
        </div>
      </div>
    );
  }
}
export default User;
