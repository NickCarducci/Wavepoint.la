import React from "react";
import firebase from "../../../.././init-firebase";
import Edit from "./Edit";
import View from "./View";

class Address extends React.Component {
  state = {};
  render() {
    const { countries, forSuggestion } = this.props;
    var suggested = "";
    if (this.props.user.address1) {
      suggested = forSuggestion.find(
        (x) => x.alpha_2 === this.props.user.country
      );
    }
    var openAddress = this.state.editAddress || !this.props.user.address1;
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: "address" })}
        onMouseLeave={() => this.setState({ hovering: "" })}
        style={
          this.state.hovering === "address"
            ? { backgroundColor: "rgba(20,20,20,.3)", width: "min-content" }
            : {}
        }
      >
        {openAddress && this.props.hasNameAndEmail ? (
          <Edit
            auth={this.props.auth}
            user={this.props.user}
            countries={countries}
          />
        ) : (
          !openAddress && (
            <View
              user={this.props.user}
              editAddress2={(e) => this.setState({ address2: e.target.value })}
            />
          )
        )}
        {this.props.user.address1 ? (
          <div>
            {this.props.user.currency && (
              <div
                onClick={this.props.finish}
                style={{
                  position: "absolute",
                  transform: "translate(-20px,4px)"
                }}
              >
                &#10004;
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: this.props.user.currency ? "row" : "column"
              }}
            >
              {this.props.user.currency ? (
                <div
                  style={{
                    width: "min-content",
                    fontSize: "14px",
                    border: "1px solid",
                    padding: "5px",
                    margin: "2px"
                  }}
                  onClick={() => {
                    var answer = window.confirm("clear currency?");
                    if (answer)
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({
                          currency: null
                        });
                  }}
                >
                  {this.props.user.currency}&nbsp;&times;
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <select
                    style={{
                      width: "min-content",
                      fontSize: "14px",
                      border: "1px solid",
                      padding: "5px",
                      margin: "2px"
                    }}
                    defaultValue={suggested.currency_code}
                    onChange={(e) =>
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({
                          currency: e.target.value
                        })
                    }
                  >
                    {forSuggestion.map((x) => {
                      return <option>{x.currency_code}</option>;
                    })}
                  </select>

                  <div
                    style={{
                      width: "min-content",
                      fontSize: "14px",
                      border: "1px solid",
                      padding: "5px",
                      margin: "2px"
                    }}
                    onClick={() =>
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({
                          currency: suggested.currency_code
                        })
                    }
                  >
                    save
                  </div>
                </div>
              )}
              {this.props.user.address1 && (
                <div
                  style={{
                    height: "36px",
                    width: "100%",
                    position: "relative",
                    borderBottom: "1px solid"
                  }}
                >
                  <div
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection("userDatas")
                        .doc(this.props.auth.uid)
                        .update({
                          address1: "",
                          address2: "",
                          city: "",
                          state: "",
                          country: "",
                          currency: null
                        })
                        .catch((err) => console.log(err.message));
                    }}
                    style={{
                      borderRadius: "12px",
                      padding: "5px 0px",
                      display: "flex",
                      position: "absolute",
                      right: "0px",
                      margin: "5px 0px",
                      fontSize: "12px",
                      height: "min-content",
                      border: "1px solid blue",
                      backgroundColor: "rgb(200,200,255)",
                      width: "56px",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    reset
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Address;
