import React from "react";
import Merchant from "./Merchant";
import PII from "./PII";

class Account extends React.Component {
  state = {};
  render() {
    const { user, auth, forSuggestion, countries, stripe } = this.props;
    var hasName = user.firstName && user.surname;
    var hasNameAndEmail = user.username && user.defaultEmail && hasName;
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Merchant user={user} auth={auth} stripe={stripe} />
        <PII
          countries={countries}
          forSuggestion={forSuggestion}
          user={user}
          auth={auth}
          deleteStripe={this.deleteStripe}
          hasName={hasName}
          hasNameAndEmail={hasNameAndEmail}
        />
      </div>
    );
  }
}
export default Account;
