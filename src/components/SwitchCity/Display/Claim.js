import React from "react";

class Claim extends React.Component {
  state = { subject: "", body: "" };
  render() {
    return (
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          position: "fixed",
          transform: `translateY(${
            this.props.showReqMayorForm ? "0" : "-100"
          }%)`,
          transition: ".3s ease-in",
          left: "0",
          top: "0",
          height: this.props.showReqMayorForm ? "min-content" : "0px",
          maxHeight: "calc(100% - 86px)",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,.8)",
          wordWrap: "break-word",
          flexDirection: "column"
        }}
      >
        <div
          onClick={this.props.clear}
          style={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "10px"
          }}
        >
          &times;
        </div>
        <div style={{ color: "rgb(220,220,250)" }}>
          enter your town email, I will ask for your reply from that email to
          give your user admin role
          <br />
          Or, add this{" "}
          {`<meta name="clerk" content="${
            this.props.user !== undefined && this.props.user.username
          }">`}{" "}
          to your html header & send me an email with website name + your
          username
        </div>
        <div
          className="formbkgd"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <form
            className="emailform"
            style={{ position: "absolute", width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `mailto:nick@thumbprint.us?subject=${this.state.subject}&body=${this.state.body}`
              );
            }}
          >
            <input
              onChange={(e) => this.setState({ subject: e.target.value })}
              placeholder={`${
                this.props.user !== undefined && this.props.user.username
              } is ${this.props.showReqMayorForm} clerk`}
            />
            <textarea
              placeholder={`I will confirm using my town-email, or add the meta tag to my town website`}
              onChange={(e) => this.setState({ body: e.target.value })}
            />
          </form>
          <div
            style={{
              position: "relative",
              color: "rgb(200,200,250)"
            }}
          >
            nick@thumbprint.us
          </div>
        </div>
      </div>
    );
  }
}
export default Claim;
