import React from "react";

class GoogleLoginButton extends React.Component {
  render() {
    if (
      this.props.openDrivePicker ||
      this.props.addPic ||
      this.props.profileOpen
    ) {
      return (
        <div style={{ height: "56px" }}>
          <img
            style={{ display: "flex", position: "absolute", zIndex: "-1" }}
            src="https://www.dl.dropboxusercontent.com/s/jzurc6h03qzdr7q/btn_google_signin_dark_pressed_web.png?dl=0"
            alt="err"
          />
          <div
            style={{
              opacity: "0",
              height: "46px",
              width: "200px",
              border: "1px solid black"
            }}
            ref={this.props.setGoogleLoginRef}
            id="loginButton"
            onClick={() => {
              //!this.props.picker2 && this.props.loadGapiApi();
              this.props.loadGapiApi();
            }}
          >
            Sign In
          </div>
        </div>
      );
    } else return null;
  }
}
export default GoogleLoginButton;
