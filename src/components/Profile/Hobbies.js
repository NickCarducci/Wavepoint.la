import React from "react";
import firebase from "../.././init-firebase";

class Hobbies extends React.Component {
  state = {};
  render() {
    const { availableStuff } = this.props;
    return (
      <div style={{ marginTop: "10px" }}>
        <div
          style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}
        >
          {!this.state.add && (
            <div
              style={{
                fontSize: "15px",
                marginRight: "10px",
                backgroundColor: "blue",
                color: "white",
                height: "20px",
                width: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={() => this.setState({ add: true })}
            >
              <b>+</b>
            </div>
          )}
          <label style={{ color: "grey", fontSize: "16px" }}>Hobbies</label>
          {this.props.user.hobbies && (
            <div
              style={{
                color: "grey",
                marginLeft: "10px",
                fontSize: "12px",
                border: "1px dashed grey",
                borderRadius: "30px",
                height: "14px",
                width: "14px"
              }}
            >
              {this.props.user.hobbies.length}
            </div>
          )}
        </div>
        {this.props.user &&
          this.props.user.hobbies &&
          this.props.user.hobbies.map((x) => {
            return (
              <div
                key={x}
                style={{
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {x}
                <div
                  style={{
                    paddingLeft: "2px",
                    marginLeft: "4px",
                    color: "rgb(70,70,70)",
                    fontSize: "12px",
                    border: "1px solid grey",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    height: "14px",
                    right: "0px",
                    wordBreak: "break-all",
                    paddingRight: "3px"
                  }}
                  onClick={() => {
                    var answer = window.confirm(
                      `would you like to erase ${x} as your hobby`
                    );
                    if (answer) {
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          hobbies: firebase.firestore.FieldValue.arrayRemove(x)
                        });
                    }
                  }}
                >
                  delete
                </div>
              </div>
            );
          })}
        {this.state.add && (
          <div onClick={() => this.setState({ add: false })}>&times;</div>
        )}
        {this.state.add &&
        (!this.props.chosen || this.props.chosen.length < 6) ? (
          <select
            onChange={(e) => {
              //this.props.setHob(e);
              firebase
                .firestore()
                .collection("users")
                .doc(this.props.auth.uid)
                .update({
                  hobbies: firebase.firestore.FieldValue.arrayUnion(
                    e.target.value
                  )
                });
              this.setState({ add: false });
            }}
          >
            {availableStuff.map((x) => (
              <option>{x}</option>
            ))}
          </select>
        ) : null}
      </div>
    );
  }
}
export default Hobbies;
