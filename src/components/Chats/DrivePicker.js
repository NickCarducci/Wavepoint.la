import React from "react";
import GoogleLoginButton from "../../GoogleLoginButton";

class DrivePicker extends React.Component {
  state = { copied: false };
  render() {
    this.picker = window.picker && window.picker;
    return (
      <div
        style={
          this.props.openDrivePicker
            ? {
                display: "flex",
                zIndex: "9999",
                position: "fixed",
                left: "50%",
                top: "0px",
                width: "100%",
                height: "100%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }
            : { display: "none" }
        }
      >
        {this.props.filePreparedToSend.length > 0 && (
          <div onClick={this.props.changeFilesPreparedToSend}>
            Send Links to recipients & close
          </div>
        )}
        <br />
        {this.props.filePreparedToSend.length > 0 ? (
          <div onClick={this.props.clearFilesPreparedToSend}>
            &times;Clear selection
          </div>
        ) : (
          <div
            onClick={
              window.picker
                ? () => window.picker.setVisible(true)
                : () => window.alert("one more moment please")
            }
          >
            Open file from drive
          </div>
        )}
        <br />
        {this.props.filePreparedToSend.length > 0 && (
          <div>
            <div onClick={() => this.props.s.showSettingsDialog()}>
              Change sharing preference
            </div>
            <br />
            <div
              style={
                this.props.filePreparedToSend.length > 1
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
              {this.props.filePreparedToSend.map((x) => {
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
                    onClick={() => {
                      this.setState({ copied: true });
                      navigator.clipboard.writeText(x.url);
                    }}
                  >
                    <img src={x.iconUrl} alt="error" />
                    &nbsp;&nbsp;&nbsp;
                    <div>{x.name}</div>
                  </div>
                );
              })}
            </div>
            <div>
              {this.state.copied ? "Copied Link!" : "Click to copy link!"}
            </div>
          </div>
        )}
        <br />
        <div
          style={
            this.props.signedIn === true
              ? {
                  display: "flex"
                }
              : {
                  display: "none"
                }
          }
          onClick={this.props.signOut}
        >
          Sign Out
        </div>
        <br />
        <GoogleLoginButton
          openDrivePicker={this.props.openDrivePicker}
          picker2={this.props.picker}
          loadGapiApi={this.props.loadGapiApi}
        />
        {/*<br />
        <br />
        <div onClick={this.props.closeDrivePicker}>&times;</div>*/}
      </div>
    );
  }
}
export default DrivePicker;
