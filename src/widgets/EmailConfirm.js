import React from "react";
import Confirmable from ".././components/Bank/PII/Emails/Confirmable";

class EmailConfirm extends React.Component {
  render() {
    if (this.props.loaded && this.props.user === undefined) {
      this.props.history.push("/");
    }
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          zIndex: "6",
          width: "100%",
          height: "100%",
          backgroundColor: "white"
        }}
      >
        {!this.props.loaded && "loading"}
        {this.props.user !== undefined && this.props.user.email && (
          <Confirmable user={this.props.user} auth={this.props.auth} />
        )}
      </div>
    );
  }
}
export default EmailConfirm;
