import React from "react";
import firebase from "../../../.././init-firebase";

class Ready extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div
        style={{
          backgroundColor: "#bc47ff",
          justifyContent: "center",
          alignItems: "center",
          border: "3px solid rgb(100,200,250)",
          borderRadius: "10px",
          padding: "4px",
          display: "flex"
        }}
      >
        <div style={{ marginRight: "5px" }}>
          <div>
            {user.firstName}&nbsp;{user.surname}
          </div>
          <div onClick={() => {}} style={{ fontSize: "12px" }}>
            {user.banked
              ? `${user.currency}${user.balance} / ${user.banks} accounts`
              : "No banking apparatus installed"}
          </div>
        </div>
        <div
          onClick={() =>
            firebase
              .firestore()
              .collection("userDatas")
              .doc(this.props.auth.uid)
              .update({
                finishBank: false
              })
          }
          style={{
            backgroundColor: "rgba(250,250,250,.9)",
            display: "flex",
            position: "relative",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid grey",
            borderRadius: "10px",
            padding: "4px"
          }}
        >
          &#9998;
        </div>
      </div>
    );
  }
}
export default Ready;
