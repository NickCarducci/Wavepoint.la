import React from "react";
import firebase from "../.././init-firebase";
//import { PlaidLink } from "react-plaid-link";

class Plaid extends React.Component {
  state = {};
  render() {
    if (this.props.user) {
      return (
        <div>
          <div
            style={{
              display: "flex",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
              height: "100%",
              transform: "translateX(0%)",
              transition: ".3s ease-in",
              backgroundColor: "white"
            }}
            onClick={async () => {
              var paidSub = this.props.user.paidSub ? false : true;
              console.log(paidSub);
              if (!this.props.user.paidSub) {
                if (!this.state.language) {
                  this.props.askLanguager();
                } else {
                  if (!this.state.proceed) {
                    var answer = window.confirm(
                      "you'll need to register with plaid, proceed?"
                    );
                    if (answer) {
                      this.setState({ proceed: true });
                    }
                  }
                }
              } else {
                var answer1 = window.confirm(
                  "are you sure you want to unsubscribe? this will end your subscription"
                );
                if (answer1)
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(this.props.auth.uid)
                    .update({
                      paidSub: false
                    })
                    .catch((err) => console.log(err.message));
              }
            }}
          >
            {!this.state.proceed
              ? this.props.user.paidSub
                ? "diconnect bank"
                : "connect bank"
              : null}
            {/*this.state.proceed && (
              <PlaidLink
                clientName="Thumbprint"
                env="development"
                product={["auth", "transactions"]}
                publicKey="a860df3fcf4c05cf7090a6d01cc696"
                onExit={(metadata, error) => {
                  console.log(error);
                  console.log(metadata);
                }}
                onSuccess={async (public_token, metadata) => {
                  this.setState({ linkSessionId: metadata.link_session_id });
                  await fetch(
                    "https://us-central1-froth-7tpiu.cloudfunctions.net/initializePlaidFroth",
                    {
                      method: "POST",
                      /*headers: {
                        "Content-type": "application/json",
                        Accept: "application/json"
                      },*
                      body: JSON.stringify({
                        public_token: public_token
                      })
                    }
                  )
                    .then(async (res) => await res.json())
                    .then((response) => {
                      console.log(response);
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          paidSub: true
                        });
                    })
                    .catch((err) => console.log(err));
                }}
                language={this.state.language}
              >
                subscribe
              </PlaidLink>
              )*/}
          </div>
          <div
            onClick={() => {
              this.props.askLanguager();
              this.setState({ language: "" });
            }}
            style={{
              display: "flex",
              position: "relative"
            }}
          >
            {this.state.language}
          </div>
          <div
            style={
              this.props.askLanguage
                ? {
                    display: "flex",
                    position: "relative",
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: "100%",
                    height: "100%",
                    transform: "translateX(0%)",
                    transition: ".3s ease-in",
                    backgroundColor: "white"
                  }
                : {
                    display: "flex",
                    position: "absolute",
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: "100%",
                    height: "0%",
                    transform: "translateX(100%)",
                    transition: ".3s ease-out",
                    opacity: "0"
                  }
            }
          >
            <div
              style={{
                margin: "30px",

                flexDirection: "column"
              }}
            >
              <div style={{ padding: "10px 20px", margin: "5px" }}>
                Please select a language
              </div>
              {[
                { name: "english", code: "en" },
                { name: "french", code: "fr" },
                { name: "spanish", code: "es" },
                { name: "dutch", code: "nl" }
              ].map((x) => {
                return (
                  <div
                    key={x.code}
                    style={
                      this.state.language === x.code
                        ? {
                            padding: "10px 20px",
                            margin: "5px",
                            border: "1px solid black"
                          }
                        : { padding: "10px 20px", margin: "5px" }
                    }
                    onClick={() => this.setState({ language: x.code })}
                  >
                    {x.name}
                  </div>
                );
              })}
              <button onClick={this.props.closeAskLang}>save</button>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}
export default Plaid;
