import React from "react";
import firebase from "../../.././init-firebase.js";
import { budgetType } from "../../../widgets/arraystrings.js";
import { specialFormatting } from "../../../widgets/authdb.js";

class BudgetTypes extends React.Component {
  state = { closeNew: true };
  render() {
    return (
      <div
        style={{
          position: "relative",
          flexDirection: "column",
          border: "0px solid white",
          backgroundColor: "rgb(230,230,230)",
          color: "rgb(20,20,20)",
          width: "100%",
          breakInside: "avoid",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            transform: `rotate(${this.state.closeNew ? "180deg" : "0deg"})`,
            zIndex: this.state.closeNew ? -1 : "",
            margin: this.state.closeNew ? "2px" : "0px 20px",
            height: this.state.closeNew ? "0px" : "",
            color: "rgb(20,20,20)",
            fontSize: "14px"
          }}
        >
          {this.state.edit ? (
            <div
              style={{
                flexDirection: "column",
                margin: "10px 20px",
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between"
              }}
            >
              {["campus", "town", "state"].map((x) => {
                return (
                  <div
                    onClick={() => {
                      if (this.props.community.tract !== x) {
                        var answer = window.confirm(
                          `change ${this.props.community.message}'s budget to type: ${x}`
                        );
                        if (answer) {
                          firebase
                            .firestore()
                            .collection("communities")
                            .doc(this.props.community.id)
                            .update({ tract: x })
                            .catch((err) => console.log(err.message));
                        }
                      }

                      this.setState({ edit: false });
                    }}
                    style={{
                      display: "flex",
                      position: "relative",
                      borderBottom: `${
                        this.props.community.tract === x ? 4 : 0
                      }px solid white`
                    }}
                  >
                    {x}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                margin: "10px 10px",
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderBottom: "2px solid white"
                }}
                onClick={() => this.setState({ edit: true })}
              >
                typeset: {this.props.community.tract}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "10px 0px",
            color: "white",
            position: "relative",
            flexDirection: "column",
            border: "0px solid white",
            backgroundColor: "rgb(20,20,20)",
            width: "100%",
            breakInside: "avoid",
            display: "flex",
            alignItems: "center"
          }}
        >
          {this.state.closeNew ? (
            <div onClick={() => this.setState({ closeNew: false })}>
              {this.props.community.tract}
            </div>
          ) : (
            <div
              onClick={() =>
                this.setState({
                  closeNew: true
                })
              }
            >
              &times;
            </div>
          )}
          <div
            style={{
              transform: `rotate(${this.state.closeNew ? "180deg" : "0deg"})`,
              zIndex: this.state.closeNew ? -1 : "",
              margin: this.state.closeNew ? "2px" : "0px 20px",
              height: this.state.closeNew ? "0px" : "",
              color: "rgb(20,20,20)",
              fontSize: "14px"
            }}
          >
            <div
              style={{
                padding: "10px",
                position: "relative",
                color: "grey",
                fontSize: "18px"
              }}
            >
              Specify the budget & proposal type-set you want to display above{" "}
              <div style={{ color: "rgb(230,230,230)", fontSize: "12px" }}>
                admins control
              </div>
              {budgetType.map((x, i) => {
                const na = specialFormatting(x.name);
                return (
                  <div
                    key={i}
                    onClick={() => this.props.chooseB(na)}
                    style={{
                      width: "max-content",
                      margin: "5px 0px",
                      padding: "0px 5px",
                      color:
                        this.props.budgetTyped === na
                          ? "rgb(230,230,230)"
                          : "rgb(100,100,100)",
                      transition: ".3s ease-in"
                    }}
                  >
                    {na}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BudgetTypes;
