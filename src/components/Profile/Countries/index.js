import React from "react";
import { countries, currencies } from "../../../widgets/arraystrings";
import Bank from "../.././Bank";

class WithCountries extends React.Component {
  render() {
    var forSuggestion = countries.filter((x) =>
      currencies.includes(x.currency_code)
    );
    return (
      <Bank
        forSuggestion={forSuggestion}
        users={this.props.users}
        currentUser={this.props.currentUser}
        stripeKey={this.props.stripeKey}
        user={this.props.user}
        auth={this.props.auth}
        bankingOpen={this.props.bankingOpen}
      />
    );
  }
}
export default WithCountries;
