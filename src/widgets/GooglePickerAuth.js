import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";

class GooglePickerAuth extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          height: "min-content",
          alignItems: "center",
          backgroundColor: "rgb(200,200,250)"
        }}
      >
        <br />
        <div
          style={{
            display: "flex",
            position: "relative",
            zIndex: "9999",
            top: "0px",
            width: "100%",
            height: "min-content",
            flexDirection: "column"
          }}
        >
          {/*<input type="file" accept="image/*" multiple="false" />*/}
          <GoogleLoginButton
            setGoogleLoginRef={this.props.setGoogleLoginRef}
            profileOpen={true}
            picker2={this.props.picker2}
            loadGapiApi={this.props.loadGapiApi}
          />
          <div
            style={
              this.props.signedIn === true
                ? {
                    display: "flex",
                    position: "relative",
                    zIndex: "9999",
                    height: "56px",
                    padding: "0px 20px",
                    width: "max-content",
                    border: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center"
                  }
                : {
                    display: "none"
                  }
            }
            onClick={this.props.switchAccount}
          >
            Sign Out
          </div>
          <div
            style={
              this.props.signedIn === true
                ? {
                    display: "flex",
                    position: "relative",
                    zIndex: "9999",
                    minHeight: "56px",
                    height: "min-content",
                    padding: "20px 20px",
                    border: "1px solid black",
                    justifyContent: "center",
                    flexDirection: "column"
                  }
                : {
                    display: "none"
                  }
            }
            onClick={() => {
              var answer = window.confirm(
                "Are you sure you want to sign out of all Google apps?"
              );
              if (answer) {
                this.props.signOut();
              }
            }}
          >
            Hard Sign Out
            <br />
            <div style={{ color: "grey" }}>
              This will delete your cached passwords
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              zIndex: "9999",
              fontSize: "15px",
              height: "min-content",
              width: "100%"
            }}
          >
            <br />
            You can update this file directly in your drive,
            <br />
            we just show the thumbnail
            <br />
          </div>
        </div>
        <br />
      </div>
    );
  }
}
export default GooglePickerAuth;

/*this.state.filePreparedToSend.length > 0 && (
          <div>
            <div
              style={
                this.state.filePreparedToSend.length > 1
                  ? {
                      display: "flex",
                      padding: "0px 20px",
                      border: "1px solid #222",
                      borderRadius: "5px",
                      flexDirection: "row",
                      justifyContent: "center",
                      height: "112px",
                      alignItems: "center"
                    }
                  : {
                      display: "flex",
                      padding: "0px 20px",
                      border: "0px solid #222",
                      borderRadius: "5px",
                      flexDirection: "row",
                      justifyContent: "center",
                      height: "112px",
                      alignItems: "center"
                    }
              }
            >
              {this.state.filePreparedToSend.map(x => {
                return (
                  <div
                    style={{
                      display: "flex",
                      padding: "0px 20px",
                      border: "1px solid #222",
                      borderRadius: "5px",
                      flexDirection: "row",
                      justifyContent: "center",
                      height: "56px",
                      alignItems: "center"
                    }}
                  >
                    <img src={x.iconUrl} alt="error" />
                    &nbsp;&nbsp;&nbsp;
                    <div>{x.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )*/
