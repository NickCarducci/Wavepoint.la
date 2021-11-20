import React from "react";
import firebase from "../../.././init-firebase";
import Address from "./Address";
import Info from "./Info";
import Names from "./Names";

class PII extends React.Component {
  state = {};
  render() {
    const {
      hasName,
      hasNameAndEmail,
      user,
      auth,
      forSuggestion,
      countries
    } = this.props;
    return (
      <div
        style={{
          right: "0px",
          height: user.finishBank ? "0px" : "min-content",
          width: user.finishBank ? "0px" : "100%",
          opacity: user.finishBank ? "0" : "1",
          zIndex: user.finishBank ? "-1" : "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid grey",
          borderRadius: "10px",
          padding: "4px",
          transition: ".3s ease-out"
        }}
      >
        {hasName && !this.state.editNames ? (
          <Info
            deleteStripe={this.props.deleteStripe}
            user={user}
            auth={auth}
            editNames={() => this.setState({ editNames: true })}
          />
        ) : (
          <Names
            user={user}
            auth={auth}
            closeNames={() => this.setState({ editNames: false })}
          />
        )}
        {hasNameAndEmail && (
          <Address
            countries={countries}
            forSuggestion={forSuggestion}
            hasNameAndEmail={hasNameAndEmail}
            user={user}
            auth={auth}
            finish={() =>
              firebase
                .firestore()
                .collection("userDatas")
                .doc(auth.uid)
                .update({
                  finishBank: true
                })
            }
          />
        )}
      </div>
    );
  }
}
export default PII;
